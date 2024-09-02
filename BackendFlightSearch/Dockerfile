FROM openjdk:22-jdk-slim
LABEL authors="jorge.fabila"

WORKDIR /backend-flight-search

COPY build/libs/*.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]
