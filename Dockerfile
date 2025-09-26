# multi stage docker file 
# Stage 1
FROM node:trixie-slim as builder

WORKDIR /app

# only copy the package.json files and credentials
COPY ./package*.json  /app/

# copy the remaining code contents for runtime
COPY ./ /app/

# install the deps and devDeps
RUN npm install 

# Accept build-time arg
ARG VITE_API_KEY2

# Promote to ENV so npm build sees it
ENV VITE_API_KEY2=$VITE_API_KEY2

# build the chrome extension folder
RUN npm run build

# start with npm run command
CMD [ "npm", "run", "dev" ]


# COPY the dist folder 
# stage 2
# FROM node:22.18-alpine3.22

# WORKDIR /app

# COPY --from=builder /app/dist /app/
