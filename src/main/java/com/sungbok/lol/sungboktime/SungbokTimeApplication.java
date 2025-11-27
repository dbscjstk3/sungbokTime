package com.sungbok.lol.sungboktime;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SungbokTimeApplication {

    public static void main(String[] args) {
        // Load .env from project root (automatically finds .env in working dir)
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            String mysqlId = dotenv.get("MYSQL_ID");
            String mysqlPw = dotenv.get("MYSQL_PW");
            String riotApiKey = dotenv.get("RIOT_API_KEY");
            if (mysqlId != null) System.setProperty("MYSQL_ID", mysqlId);
            if (mysqlPw != null) System.setProperty("MYSQL_PW", mysqlPw);
            if (riotApiKey != null) System.setProperty("RIOT_API_KEY", riotApiKey);
        } catch (Exception e) {
            // ignore - dotenv is optional; missing values can come from other config sources
            System.err.println("Warning: .env not loaded: " + e.getMessage());
        }

        SpringApplication.run(SungbokTimeApplication.class, args);
    }

}
