.DEFAULT_GOAL := help
.PHONY: help install setup dev build preview lint test test-watch check clean

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

setup: install ## First-time setup: install deps and create .env
	@test -f .env || cp .env.example .env

dev: ## Start the Vite dev server (http://localhost:5173)
	npm run dev

build: ## Type-check and build for production
	npm run build

preview: ## Preview the production build locally
	npm run preview

lint: ## Run ESLint
	npm run lint

test: ## Run the Vitest suite once
	npm run test

test-watch: ## Run Vitest in watch mode
	npm run test:watch

check: lint build test ## Run lint, build, and tests (CI-style gate)

clean: ## Remove build output and installed dependencies
	rm -rf dist node_modules
