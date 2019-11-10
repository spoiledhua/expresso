from app import app
import os

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
    except Exception as e:
        print(e)
        exit(1)
