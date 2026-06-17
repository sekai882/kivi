import hmac
import hashlib

def verify_whatsapp_signature(payload: bytes, signature: str, secret: str) -> bool:
    if not signature or not secret:
        return False
    
    # Meta signature comes as 'sha256=<signature>'
    if signature.startswith('sha256='):
        signature = signature[7:]
    
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)
