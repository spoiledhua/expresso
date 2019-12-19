from flask_jwt_extended import JWTManager, jwt_required, create_access_token, \
get_jwt_identity, verify_jwt_in_request, get_jwt_claims
from flask import jsonify
from functools import wraps
#-------------------------------------------------------------------------------
jwt = JWTManager()
#-------------------------------------------------------------------------------
@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    if identity == 'admin':
        return {'roles': 'admin'}
    elif identity == 'dora':
        return {'roles': 'barista'}
    elif identity == None:
        return {'roles': 'null'}
    else:
        return {'roles': 'customer'}
#-------------------------------------------------------------------------------
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims['roles'] != 'admin':
            return jsonify(msg='Admin access only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper
#-------------------------------------------------------------------------------
def barista_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims['roles'] != 'barista' and claims['roles'] != 'admin':
            return jsonify(msg='Barista access only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper
