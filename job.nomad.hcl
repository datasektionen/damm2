job "damm" {
  type = "service"

  group "damm" {
    network {
      port "http" { }
    }

    service {
      name     = "damm"
      port     = "http"
      provider = "nomad"
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.damm.rule=Host(`damm.datasektionen.se`)",
        "traefik.http.routers.damm.tls.certresolver=default",
      ]
    }

    task "damm" {
      driver = "docker"

      config {
        image = var.image_tag
        ports = ["http"]
      }

      template {
        data        = <<ENV
{{ with nomadVar "nomad/jobs/damm" }}
DATABASE_URL=postgres://damm:{{ .db_password }}@postgres.dsekt.internal:5432/damm
LOGIN_API_KEY={{ .login_key }}
AWS_SECRET_ACCESS_KEY={{ .aws_access_key }}
AWS_ACCESS_KEY_ID={{ .aws_access_id }}
HIVE_API_KEY={{ .hive_api_key }}
{{ end }}
PORT={{ env "NOMAD_PORT_http" }}
NODE_ENV=production
AWS_S3_BUCKET=dsekt-damm-prod
LOGIN_URL=https://login.datasektionen.se
HIVE_API_URL=https://hive.datasektionen.se/api/v1
ENV
        destination = "local/.env"
        env         = true
      }

      resources {
        memory = 512
      }
    }
  }
}

variable "image_tag" {
  type = string
  default = "ghcr.io/datasektionen/damm2:latest"
}
