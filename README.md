# Petshop Full-Stack – DevSecOps Starter

Ứng dụng Petshop gồm **React + TypeScript frontend**, **Java 17 + Spring Boot backend** và **MySQL 8 database**. Source được tổ chức để học CI/CD, security scanning, Docker, Ansible, Kubernetes, Terraform/AWS, Prometheus và Grafana.

## 1. Kiến trúc

```text
Browser
   |
   v
React + TypeScript + Vite / Nginx (port 5173 local, 80 container)
   |  /api/*
   v
Spring Boot REST API (port 8080)
   |
   v
MySQL 8 (port 3306)
```

## 2. Chức năng

- Xem danh sách thú cưng.
- Thêm thú cưng mới.
- Xóa thú cưng.
- Tạo đơn hàng theo thú cưng, tên khách hàng và số lượng.
- Xem danh sách đơn hàng.
- Health endpoint: `/actuator/health`.
- Dữ liệu được lưu trong MySQL, không mất khi container restart nếu giữ volume.

## 3. Yêu cầu chạy local

- Docker Desktop + Docker Compose plugin.
- Hoặc JDK 17, Maven 3.8+, Node.js 20+ và MySQL 8.

## 4. Chạy toàn bộ ứng dụng bằng Docker Compose (khuyến nghị)

Tại thư mục gốc:

```powershell
docker compose up -d --build
docker compose ps
```

Mở:
- Frontend: http://localhost:5173
- Backend health: http://localhost:8080/actuator/health
- API pets: http://localhost:8080/api/pets

Xem log:

```powershell
docker compose logs -f
```

Dừng ứng dụng (giữ database volume):

```powershell
docker compose down
```

Xóa cả database volume (sẽ mất dữ liệu):

```powershell
docker compose down -v
```

## 5. Chạy từng phần để phát triển

### Backend

```powershell
cd backend
mvn spring-boot:run
```

Backend đọc cấu hình từ environment. Mặc định trong `application.yml` là MySQL local tại `localhost:3306`, database `petshop_db`, user `petshop`, password `petshop_dev_password`. Có thể override bằng `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite proxy `/api` và `/actuator` đến `http://localhost:8080`.

## 6. API nhanh

```http
GET    /api/pets
GET    /api/pets/{id}
POST   /api/pets
DELETE /api/pets/{id}
GET    /api/orders
POST   /api/orders
GET    /actuator/health
```

Tạo thú cưng:

```json
{
  "name": "Luna",
  "species": "Cat",
  "breed": "British Shorthair",
  "price": 150.0,
  "imageUrl": "",
  "description": "Friendly indoor cat",
  "available": true
}
```

Tạo đơn hàng:

```json
{
  "customerName": "Nguyen Van A",
  "petId": 1,
  "quantity": 2
}
```

## 7. DevSecOps assets

- `Jenkinsfile`: pipeline mẫu build/test, SonarQube, OWASP Dependency-Check, Docker build, Trivy, push registry, apply Kubernetes.
- `backend/Dockerfile`, `frontend/Dockerfile`: multi-stage builds.
- `docker-compose.yml`: chạy frontend/backend/MySQL local.
- `kubernetes/`: Secret, PVC, MySQL, backend, frontend và Ingress.
- `ansible/`: inventory mẫu và playbook kiểm tra/apply manifests.
- `monitoring/`: Prometheus scrape config mẫu.

Trước khi chạy Jenkins pipeline cần cấu hình Jenkins tools/credentials và thay `DOCKERHUB_USERNAME`. Không commit mật khẩu thật, kubeconfig, private key hoặc token vào Git.

## 8. Ghi chú

Đây là starter project phục vụ học tập, chưa phải hệ thống production. Chưa có đăng nhập/authorization, thanh toán, upload ảnh, migration tool, backup tự động hoặc HA database. Kubernetes manifests dùng cấu hình lab; cần điều chỉnh storage class, secrets, ingress controller và tài nguyên theo cluster thực tế.
