# 멀티 스테이지 빌드: 백엔드 빌드
FROM gradle:8.14-jdk17 AS backend-builder

WORKDIR /app

# Gradle 캐시를 활용하기 위해 의존성 먼저 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 의존성 다운로드 (캐시 활용)
RUN gradle dependencies --no-daemon || true

# 소스 코드 복사
COPY src ./src

# 빌드 실행 (Spring Boot JAR 생성)
RUN gradle bootJar -x test --no-daemon

# JAR 파일 생성 확인
RUN ls -la /app/build/libs/ || (echo "JAR 파일이 생성되지 않았습니다!" && exit 1)

# 최종 런타임 이미지
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 백엔드 JAR 파일 복사 (Spring Boot bootJar만)
# plain JAR는 build.gradle에서 비활성화했으므로 bootJar만 존재
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# 포트 노출
EXPOSE 8080

# 환경 변수 설정 (필요시 오버라이드 가능)
ENV SPRING_PROFILES_ACTIVE=prod

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
