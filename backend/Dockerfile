### Stage Build ###
FROM maven:4.0.0-rc-7-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

### Stage Run ###
FROM eclipse-temurin:17.0.21_9-jre-ubi10-minimal

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]