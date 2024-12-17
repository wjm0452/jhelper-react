FROM openjdk:17
COPY ./build/libs/jhelper-0.0.1-SNAPSHOT.jar /app/jhelper/app.jar
COPY ./data/users.json /app/jhelper/data/users.json
WORKDIR /app/jhelper
EXPOSE 9080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]