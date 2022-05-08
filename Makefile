PROJECT_NAME=stool_cv_backend

install-dependencies:
	docker compose -p ${PROJECT_NAME} -f environments/ci.yml run install-dependencies
yarn-add:
	PACKAGE=${PACKAGE} docker compose -p ${PROJECT_NAME} -f environments/ci.yml run yarn-add
yarn-remove:
	PACKAGE=${PACKAGE} docker compose -p ${PROJECT_NAME} -f environments/ci.yml run yarn-remove
build:
	cp ./nest/.env.dev ./nest/.env
	docker compose -p ${PROJECT_NAME} -f environments/ci.yml run build
up:
	cp ./nest/.env.dev ./nest/.env
	docker compose -p ${PROJECT_NAME} -f environments/development.yml up --force-recreate --remove-orphans -d
down:
	cp ./nest/.env.dev ./nest/.env
	docker compose -p ${PROJECT_NAME} -f environments/development.yml down
