import boto3
import json
import uuid
import re
from datetime import datetime
from PyPDF2 import PdfReader
from io import BytesIO

cv_folder = 'ia-gen-cv2'
prompt_cv_folder = 'ia-gen-prompt-cv'
output_cv_folder = 'ia-gen-cv-output'

s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')
table_cv = dynamodb.Table('evaluation_cv')

def extract_information_from_cv(text):
    patterns = [
        r'Nom et Prénom(?:\s*.*)',
        r"Profil Principal(?:\s*.*)",
        r"Expérience(?:\s*.*)",
        r'Technologies Majeures(?:\s*.*)',
        r"Technologies Mineures(?:\s*.*)",
        r"Domaines Fonctionnels(?:\s*.*)",
        r"Attractivité(?:\s*.*)",
        r"Points Forts(?:\s*.*)",
        r"Points d'Amélioration(?:\s*.*)",
        r"Recommandations(?:\s*.*)"
    ]
    
    matches = []
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            matches.append(match.group(0))
    return matches


def read_s3_object(bucket_name, key):
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    return obj['Body'].read().decode('utf-8')
 
    
def read_pdf_object(bucket_name, key):
    pdf_file = s3.get_object(Bucket=bucket_name, Key=key)["Body"].read()
    pdf = PdfReader(BytesIO(pdf_file))
    data = "\n".join([page.extract_text() for page in pdf.pages])
    return data


def safe_split(result, index, delimiter, part_index):
    try:
        return result[index].split(delimiter)[part_index].strip()
    except IndexError:
        return None

def lambda_handler(event, context):

    client = boto3.client("bedrock-runtime", region_name="eu-west-3")
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    prompt_cv_keys = s3.list_objects_v2(Bucket=prompt_cv_folder)['Contents']
    prompt_cv_text = read_s3_object(prompt_cv_folder, prompt_cv_keys[0]['Key'])
    
    cv_keys = s3.list_objects_v2(Bucket=cv_folder)['Contents']
    
    for cv_key in cv_keys:
        cv_text = read_pdf_object(cv_folder, cv_key['Key'])
        prompt_cv = f"{prompt_cv_text}\n\nCV:\n{cv_text}"
        native_request_cv = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2048,
                "temperature": 0.7,
                "top_p": 0.9,
                "messages": [{
                        "role": "user",
                        "content": [{"type": "text", 
                                     "text": prompt_cv}
                                    ],
                    }
                ],
            }
        
        request_cv = json.dumps(native_request_cv)
        response_cv = client.invoke_model(modelId=model_id, body=request_cv)
        model_response_cv = json.loads(response_cv["body"].read())
          
        response_text_cv = model_response_cv["content"][0]
        response_text_cv = response_text_cv['text']
        result_cv = extract_information_from_cv(response_text_cv)
        print(result_cv)
        
        key_cv = f'{uuid.uuid4()}.txt'
        s3.put_object(Bucket=output_cv_folder, Body=response_text_cv, Key=key_cv)
        
        nom_candidat = safe_split(result_cv, 0, ';', 1)
        profil = safe_split(result_cv, 1, ';', 1)
        experience = safe_split(result_cv, 2, ';', 1)
        techno_majeures = safe_split(result_cv, 3, ';', 1)
        techno_mineures = safe_split(result_cv, 4, ';', 1)
        attractivite = safe_split(result_cv, 5, ';', 1)
        points_forts = safe_split(result_cv, 6, ';', 1)
        points_amélioration = safe_split(result_cv, 7, ';', 1)
        recommandations = safe_split(result_cv, 8, ';', 1)
        
        evaluation_cv = {
                'id': f'{nom_candidat}',
                'date': datetime.now().strftime("%Y-%m-%d"),
                'profil': profil,
                'experience': experience,
                'techno_majeures': techno_majeures,
                'techno_mineures': techno_mineures,
                'attractivite': attractivite,
                'points_forts': points_forts,
                'points_amélioration': points_amélioration,
                'recommandations': recommandations,
    
            }
            
        print(evaluation_cv)
        table_cv.put_item(Item=evaluation_cv)
        
    return {
        'statusCode': 200,
        'body': json.dumps(f'{evaluation_cv}')
    }
    