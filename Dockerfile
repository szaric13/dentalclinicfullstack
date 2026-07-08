# ---------- Build frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY dentafront/dental-clinic-app/package.json dentafront/dental-clinic-app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile
COPY dentafront/dental-clinic-app/ ./
RUN pnpm run build

# ---------- Build backend + ubaci frontend ----------
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY dental-clinic/dental-clinic/pom.xml .
COPY dental-clinic/dental-clinic/src ./src
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# ---------- Runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]