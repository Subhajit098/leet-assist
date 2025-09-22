#! /usr/bin/bash

container_name="container_leet_assist"
image_name="leet-assist:v1"

# docker build and tag command : 
echo "Executing docker build command....."
API_KEY=$(grep '^VITE_API_KEY2=' .env | cut -d '=' -f2-)
docker build --build-arg VITE_API_KEY2="$API_KEY" -t $image_name -f Dockerfile.dev .


# docker run command : 
echo "Executing docker run command....."
docker run -d --name $container_name $image_name

# copy the dist folder from the container to the current directory
echo "Executing docker copy command"
docker cp $container_name:/app/dist  ./

# Stop the container and Clean up the space ; 
echo "Executing docker clean up commands"
docker stop $container_name
docker rm -f $container_name

# remove the dangling images
docker rmi $image_name
# remove the intermediate images which arent tagged (or tagged as <none>)
docker image prune
