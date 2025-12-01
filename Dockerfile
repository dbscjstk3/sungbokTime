# 단순 런타임 이미지 (로컬에서 빌드한 JAR 사용)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 로컬에서 빌드한 JAR 파일 복사
# 빌드: ./gradlew bootJar (로컬에서 실행)
COPY build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 환경 변수 설정 (필요시 오버라이드 가능)
ENV SPRING_PROFILES_ACTIVE=prod

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
