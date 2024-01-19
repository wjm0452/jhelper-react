FROM openjdk:17
COPY ./build/libs/jhelper-0.0.1-SNAPSHOT.jar /app/jhelper/app.jar
COPY ./data/users.json /app/jhelper/data/users.json
WORKDIR /app/jhelper
EXPOSE 9080
CMD ["java", "-jar", "app.jar"]