import re

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