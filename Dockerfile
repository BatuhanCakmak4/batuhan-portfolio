FROM node:20-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://127.0.0.1:'+process.env.PORT+'/healthz',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
