import boto3
import json
import uuid
import re
from datetime import datetime
from PyPDF2 import PdfReader
from io import BytesIO

ao_folder = 'ia-gen-ao'
prompt_ao_folder = 'ia-gen-prompt-ao'
output_ao_folder = 'ia-gen-ao-output'

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_ao = dynamodb.Table('evaluation_ao')


def extract_information_from_ao(text):
    patterns = [
        r'Émetteur AO(?:\s*.*)',
        r"Durée(?:\s*.*)",
        r"Date de démarrage(?:\s*.*)",
        r'Profils demandés(?:\s*.*)',
        r"Technologies majeures(?:\s*.*)",
        r"Technologies secondaires(?:\s*.*)",
        r"Expérience requise(?:\s*.*)",
        r"Domaines fonctionnels(?:\s*.*)",
        r"Synthèse AO(?:\s*.*)",
        r"Synthèse profil recherché(?:\s*.*)",
        r"Description de l'AO(?:\s*.*)",
        r"Description du profil recherché(?:\s*.*)"
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
    
    prompt_ao_keys = s3.list_objects_v2(Bucket=prompt_ao_folder)['Contents']
    prompt_ao_text = read_s3_object(prompt_ao_folder, prompt_ao_keys[0]['Key'])
    
 
    ao_keys = s3.list_objects_v2(Bucket=ao_folder)['Contents']
    
    for ao_key in ao_keys:
        ao_text = read_pdf_object(ao_folder, ao_key['Key'])
        prompt_ao = f"{prompt_ao_text}\n\nCV:\n{ao_text}"
        native_request_ao = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2048,
                "temperature": 0.7,
                "top_p": 0.9,
                "messages": [{
                        "role": "user",
                        "content": [{"type": "text", 
                                     "text": prompt_ao}
                                    ],
                    }
                ],
            }
        
        request_ao = json.dumps(native_request_ao)
        response_ao = client.invoke_model(modelId=model_id, body=request_ao)
        model_response_ao = json.loads(response_ao["body"].read())
          
        response_text_ao = model_response_ao["content"][0]
        response_text_ao = response_text_ao['text']
        print(response_text_ao)
        result_ao = extract_information_from_ao(response_text_ao)
        print(result_ao)
        
        key_ao = f'{uuid.uuid4()}.txt'
        s3.put_object(Bucket=output_ao_folder, Body=response_text_ao, Key=key_ao)
        
        emetteur = safe_split(result_ao, 0, ';', 1)
        duree = safe_split(result_ao, 1, ';', 1)
        date_demarrage = safe_split(result_ao, 2, ';', 1)
        profils_demandes = safe_split(result_ao, 3, ';', 1)
        techno_majeures = safe_split(result_ao, 4, ';', 1)
        techno_secondaires = safe_split(result_ao, 5, ';', 1)
        experience_requise = safe_split(result_ao, 6, ';', 1)
        points_amélioration = safe_split(result_ao, 7, ';', 1)
        domaines_fonctionnels = safe_split(result_ao, 8, ';', 1)
        synthese_ao = safe_split(result_ao, 9, ';', 1)
        synthese_profil_recherche = safe_split(result_ao, 10, ';', 1)
        description_ao = safe_split(result_ao, 11, ';', 1)
        description_profil_recherche = safe_split(result_ao, 12, ';', 1)
        
        evaluation_ao = {
                'id': f'{emetteur}_{datetime.now().strftime("%Y-%m-%d")}',
                'date': datetime.now().strftime("%Y-%m-%d"),
                'emetteur': emetteur,
                'duree': duree,
                'date_demarrage': date_demarrage,
                'profils_demandes': profils_demandes,
                'techno_majeures': techno_majeures,
                'techno_secondaires': techno_secondaires,
                'experience_requise': experience_requise,
                'domaines_fonctionnels': domaines_fonctionnels,
                'synthese_ao': synthese_ao,
                'synthese_profil_recherche': synthese_profil_recherche,
                'description_ao': description_ao,
                'description_profil_recherche': description_profil_recherche
    
            }
            
        print(evaluation_ao)
        table_ao.put_item(Item=evaluation_ao)
        
        return {
        'statusCode': 200,
        'body': json.dumps(f'{evaluation_ao}')
        }
    