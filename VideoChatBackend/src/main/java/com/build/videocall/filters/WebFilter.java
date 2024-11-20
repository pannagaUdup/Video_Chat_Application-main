package com.build.videocall.filters;

import java.io.IOException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class WebFilter  implements Filter{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest=(HttpServletRequest) request;
        HttpServletResponse httpResponse=(HttpServletResponse) response;
        HttpSession session= httpRequest.getSession(false);

        if(session!=null){
            LocalDateTime usertime=(LocalDateTime) session.getAttribute("usertime");
            if(usertime!=null){
                Duration duration=Duration.between(usertime, LocalDateTime.now());
                if(duration.toMinutes()>=120){
                    session.invalidate();
                    httpResponse.sendRedirect("/");
                }
            }
        }
        chain.doFilter(request, response);  

    }

    
}
