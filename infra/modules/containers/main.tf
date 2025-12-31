resource "scaleway_container" "nextjs_app" {
  name           = "${var.container_name}-${replace(var.registry_image, "[:/]", "-")}"
  namespace_id   = var.namespace_id
  registry_image = var.registry_image

  port         = 3000
  min_scale    = var.min_scale
  max_scale    = var.max_scale
  memory_limit = var.memory_limit
  cpu_limit    = var.cpu_limit

  environment_variables = {
    NODE_ENV = "production"
    PORT     = "3000"
  }
}
