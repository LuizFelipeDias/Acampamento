package br.org.gap.acampamento.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Origens permitidas vêm de CORS_ALLOWED_ORIGINS (lista separada por vírgula). */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String[] origensPermitidas;

    public WebConfig(@Value("${app.cors.allowed-origins}") String[] origensPermitidas) {
        this.origensPermitidas = origensPermitidas;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(origensPermitidas)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
