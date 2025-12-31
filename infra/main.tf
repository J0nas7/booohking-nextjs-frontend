data "scaleway_container_namespace" "nextjs_namespace" {
  name   = var.namespace_name
  region = var.region
}

module "nextjs_app" {
  source = "./modules/containers"

  container_name = var.container_name
  registry_image = var.registry_image
  namespace_id   = data.scaleway_container_namespace.nextjs_namespace.id

  # optional overrides
  min_scale    = 0
  max_scale    = 5
  memory_limit = 256
  cpu_limit    = 140
}

terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.9" # pick the latest stable version
    }
  }

  required_version = ">= 1.5.0"
}

provider "scaleway" {
  access_key         = var.scaleway_access_key
  secret_key         = var.scaleway_secret_key
  project_id = var.scaleway_project_id
  region             = var.region
  zone               = "fr-par-1"
}
