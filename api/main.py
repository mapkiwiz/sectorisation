from bootstrap import app, db
from proxy import ReverseProxied
from controllers import *

app.wsgi_app = ReverseProxied(app.wsgi_app)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)
