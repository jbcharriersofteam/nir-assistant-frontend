import boto3
import json
import uuid
import re
import os
from datetime import datetime
from PyPDF2 import PdfReader
from io import BytesIO
from helper import extract_information_from_cv

cv_folder = 'ia-gen-cv2'
ao_folder = 'ia-gen-ao'
prompt_folder = 'ia-gen-prompt'
output_folder = 'ia-gen-score'
prompt_cv_folder = 'ia-gen-prompt-cv'
output_cv_folder = 'ia-gen-cv-output'

s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('softeam_evaluation')
table_cv = dynamodb.Table('evaluation_cv')

def read_s3_object(bucket_name, key):
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    return obj['Body'].read().decode('utf-8')
 
def write_s3_object(key, content):
    s3.put_object(Bucket=bucket_name, Key=key, Body=content.encode('utf-8'))
    
def read_pdf_object(bucket_name, key):
    pdf_file = s3.get_object(Bucket=bucket_name, Key=key)["Body"].read()
    pdf = PdfReader(BytesIO(pdf_file))
    data = "\n".join([page.extract_text() for page in pdf.pages])
    return data


def extract_information_from_text(text):
    patterns = [
        r'Nom et prénom du candidat\s*:\s*.*',
        r"Titre de l'appel d'offre\s*:\s*.*",
        r"Client de l'AO\s*:\s*.*",
        r'Profil majeur candidat\s*:\s*.*',
        r"Profil attendu appel d'offre\s*:\s*.*",
        r"Technologie majeure appel d'offre\s*:\s*.*",
        r"Technologie majeure candidat\s*:\s*.*",
        r"Domaine fonctionnel majeur requis par l'appel d'offre\s*:\s*.*",
        r"Domaine fonctionnel maîtrisé par le candidat\s*:\s*.*",
        r"Méthodologie projet requise par l'appel d'offre\s*:\s*.*",
        r"Méthodologie projet maîtrisée par le candidat\s*:\s*.*",
        r'profil_score(?:\s*.*)',
        r'techno_majeur_score(?:\s*.*)',
        r'experience_score(?:\s*.*)',
        r'competences_score(?:\s*.*)',
        r'formation_score(?:\s*.*)',
        r'methodologie_score(?:\s*.*)',
        r'domaine_score(?:\s*.*)',
        r'classe_matching(?:\s*.*)',
        r'global_score(?:\s*.*)'
    ]
    
    matches = []
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            matches.append(match.group(0))
    return matches


def safe_split_element(result, index1, index2, default_value=''):
    try:
        return result[index1].split(';')[index2].strip()
    except IndexError:
        return default_value

def safe_split(result, index, delimiter, part_index):
    try:
        return result[index].split(delimiter)[part_index].strip()
    except IndexError:
        return None

def lambda_handler(event, context):

    client = boto3.client("bedrock-runtime", region_name="eu-west-3")
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    prompt_keys = s3.list_objects_v2(Bucket=prompt_folder)['Contents']
    prompt_text = read_s3_object(prompt_folder, prompt_keys[0]['Key'])
    
    prompt_cv_keys = s3.list_objects_v2(Bucket=prompt_cv_folder)['Contents']
    prompt_cv_text = read_s3_object(prompt_cv_folder, prompt_cv_keys[0]['Key'])
    
    ao_keys = s3.list_objects_v2(Bucket=ao_folder)['Contents']

    cv_keys = s3.list_objects_v2(Bucket=cv_folder)['Contents']
    
    for cv_key in cv_keys:
        cv_text = read_pdf_object(cv_folder, cv_key['Key'])          
        for ao_key in ao_keys:
            print(f'Evaluation du CV : {cv_key['Key']} | Poste : {ao_key['Key']} \n\n')
            ao_text = read_pdf_object(ao_folder, ao_key['Key'])

            prompt = f"{prompt_text}\n\nAppel d'offre:\n{ao_text}\n\nCV:\n{cv_text}"
            
            native_request = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2048,
                "temperature": 0.7,
                "top_p": 0.9,
                "messages": [{
                        "role": "user",
                        "content": [{"type": "text", 
                                     "text": prompt}
                                    ],
                    }
                ],
            }
        
            request = json.dumps(native_request)
            response = client.invoke_model(modelId=model_id, body=request)
            model_response = json.loads(response["body"].read())
          
            response_text = model_response["content"][0]
            response_text = response_text['text']
            result = extract_information_from_text(response_text)
            
            candidat            = safe_split(result, 0, ':', 1)
            appel_offre         = safe_split(result, 1, ':', 1)
            client_ao           = safe_split(result, 2, ':', 1)
            profil_candidat     = safe_split(result, 3, ':', 1)
            profil_attendu      = safe_split(result, 4, ':', 1)
            techno_ao           = safe_split(result, 5, ':', 1)
            techno_candidat     = safe_split(result, 6, ':', 1)
            domaine_ao          = safe_split(result, 7, ':', 1)
            domaine_candidat    = safe_split(result, 8, ':', 1)
            methodo_ao          = safe_split(result, 9, ':', 1)
            methodo_candidat    = safe_split(result, 10, ':', 1)
            profil_score        = safe_split(result, 11, ';', 1)
            techno_majeur_score = safe_split(result, 12, ';', 1)
            experience_score    = safe_split(result, 13, ';', 1)
            competences_score   = safe_split(result, 14, ';', 1)
            formation_score     = safe_split(result, 15, ';', 1)
            methodologie_score  = safe_split(result, 16, ';', 1)
            domaine_score       = safe_split(result, 17, ';', 1)
            classe_matching     = safe_split(result, 18, ';', 1)
            global_score        = safe_split(result, 19, ';', 1)
                

            justifications  = f"{safe_split_element(result, 11, 2)}\n{safe_split_element(result, 12, 2)}\n{safe_split_element(result, 13, 2)}\n{safe_split_element(result, 14, 2)}\n{safe_split_element(result, 15, 2)}\n{safe_split_element(result, 16, 2)}\n{safe_split_element(result, 17, 2)}"
            recommandations = f"{safe_split_element(result, 11, 3)}\n{safe_split_element(result, 12, 3)}\n{safe_split_element(result, 13, 3)}\n{safe_split_element(result, 14, 3)}\n{safe_split_element(result, 15, 3)}\n{safe_split_element(result, 16, 3)}\n{safe_split_element(result, 17, 3)}"
            
            key = f'{appel_offre} {candidat}.txt'
            s3.put_object(Bucket=output_folder, Body=response_text, Key=key)
            
            ao_file_name = os.path.splitext(os.path.basename(f"{ao_folder}/{ao_key}"))[0]
            cv_file_name = os.path.splitext(os.path.basename(f"{cv_folder}/{cv_key}"))[0]
            
            evaluation = {
                'id': f'{ao_file_name}-{cv_file_name}',
                'date': datetime.now().strftime("%Y-%m-%d"),
                
                'candidat': cv_file_name,
                'appel_offre': ao_file_name,
                'client_ao': client_ao,
                'profil_candidat': profil_candidat,
                'profil_attendu': profil_attendu,
                'techno_ao': techno_ao,
                'techno_candidat': techno_candidat,
                'domaine_ao': domaine_ao,
                'domaine_candidat': domaine_candidat,
                'methodo_ao': methodo_ao,
                'methodo_candidat': methodo_candidat,
                'profil_score': profil_score,
                'techno_majeur_score': techno_majeur_score,
                'experience_score': experience_score,
                'competences_score': competences_score,
                'formation_score': formation_score,
                'methodologie_score': methodologie_score,
                'domaine_score': domaine_score,
                'classe_matching': classe_matching,
                'global_score': global_score,
                'justifications': justifications,
                'recommandations': recommandations
            
            }
            
            table.put_item(Item=evaluation)
        
        #s3.delete_object(Bucket=cv_folder, Key=cv_key['Key'])

    return {
                'statusCode': 200,
                'body': json.dumps(f'{evaluation}')
            }
    