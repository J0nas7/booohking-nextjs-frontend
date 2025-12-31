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
