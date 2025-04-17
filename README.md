docker run -d -p 3306:3306 --platform linux/x86_64 --name tcashbank  -e MYSQL_ROOT_PASSWORD=tcashbank mysql:8.4

##### Create Database and tables

```bash
# Create DB's
docker exec -it tcashbank mysql -uroot -ptcashbank

> CREATE DATABASE `tcashbank_queue_system`;
```


```shell
npm run migration:generate --name={name}
```
