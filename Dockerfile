# 멀티 스테이지 빌드: 백엔드 빌드
FROM gradle:8.5-jdk17 AS backend-builder

WORKDIR /app

# Gradle 캐시를 활용하기 위해 의존성 먼저 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 의존성 다운로드 (캐시 활용)
RUN gradle dependencies --no-daemon || true

# 소스 코드 복사
COPY src ./src

# 빌드 실행
RUN gradle build -x test --no-daemon

# 최종 런타임 이미지
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 백엔드 JAR 파일 복사
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 환경 변수 설정 (필요시 오버라이드 가능)
ENV SPRING_PROFILES_ACTIVE=prod

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
