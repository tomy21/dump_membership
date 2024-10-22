FROM node:20-alpine

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json (atau yarn.lock) ke dalam direktori kerja
COPY package*.json ./

# Menginstall dependencies aplikasi
RUN npm install

# Menyalin sisa file aplikasi ke dalam direktori kerja
COPY . .

# Membangun aplikasi React untuk produksi
RUN npm run build

RUN npm i -g serve

# Mengekspos port yang akan digunakan
EXPOSE 4002

# Menetapkan perintah untuk menjalankan aplikasi di dalam container
CMD ["serve", "-s", "build"]