import React from 'react';

export default function PageNotfound() {
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
            <img src="/expired.svg" className="w-40" alt="" />
            <h1 className="text-3xl font-bold">Pendaftaran Tutup</h1>
            <p className="text-center mt-10 text-base px-5">
              Maaf pendaftaran member sudah di tutup.
            </p>
            <p className="text-center text-base px-5">
              Kami akan buka kembali tanggal 20
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
