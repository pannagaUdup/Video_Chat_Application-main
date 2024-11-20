package com.build.videocall.websocket;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.build.videocall.Service.WebSocketSessionService;

import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;

import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new VideoCallHandler(), "/videoCall")
        .addInterceptors(new HttpSessionHandshakeInterceptor() {
            @Override
            public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                String userId = ((ServletServerHttpRequest) request).getServletRequest().getSession().getAttribute("userId").toString();
                attributes.put("userId", userId);
                return super.beforeHandshake(request, response, wsHandler, attributes);
            }
        })
        .setAllowedOrigins("*");
    }
}



// public class WebSocketConfig implements WebSocketConfigurer {


//    private final WebSocketSessionService sessionService;

//     public WebSocketConfig(WebSocketSessionService sessionService) {
//         this.sessionService = sessionService;
//     }


//     @Override
//     public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//         registry.addHandler(new VideoCallHandler(sessionService), "/videoCall")
//                 .addInterceptors(new HttpSessionHandshakeInterceptor() {
//                     @Override
//                     public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
//                         ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
//                         String userId = (String) servletRequest.getServletRequest().getSession().getAttribute("userId");
//                         attributes.put("userId", userId);
//                         return super.beforeHandshake(request, response, wsHandler, attributes);
//                     }
//                 })
//                 .setAllowedOrigins("*");


        
        
//         registry.addHandler(new HomePageHandler(sessionService), "/homePageWebSocket")
//         .addInterceptors(new HttpSessionHandshakeInterceptor() {
//             @Override
//             public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
//                 ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
//                 String userId = (String) servletRequest.getServletRequest().getSession().getAttribute("userId");
//                 attributes.put("userId", userId);
//                 return super.beforeHandshake(request, response, wsHandler, attributes);
//             }
//         })
//         .setAllowedOrigins("*");
                
//     }
// }

