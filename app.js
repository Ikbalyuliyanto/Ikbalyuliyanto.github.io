const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');
const { createWorker } = require("tesseract.js");
const { v4: uuid } = require('uuid');
const Table = require('cli-table');

const port = process.env.PORT || 2900;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * BASED ON MANY QUESTIONS
 * Actually ready mentioned on the tutorials
 * 
 * Many people confused about the warning for file-upload
 * So, we just disabling the debug for simplicity.
 */
app.use(fileUpload({
  debug: false
}));

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});



const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  authStrategy: new LocalAuth()
});


client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Connecting...');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code received,  please scan...');
    });
  });

  client.on('ready', () => {
    const clientNumber = client.info.wid.user; // Mendapatkan nomor klien
    socket.emit('ready', `${clientNumber} Connected Whatsapp BotServer`);
    socket.emit('message', ` Whatsapp Number : ${clientNumber} Connected`);
    socket.emit('message', `SOLVUS BOT SERVER READY TO PLAY...`);
  });

  client.on('authenticated', () => {
    socket.emit('authenticated', 'Prepairing Whatsapp!');
    socket.emit('message', 'Prepairing Whatsapp!');
    console.log('QRcode Ready');
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Auth failure, restarting...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp is disconnected!');
    client.destroy();
    client.initialize();
  });
});

// Nama file yang ingin dihapus

//Foto



//Fungsi-fungsi

function validateFormat(data) {
  const regex = /^([^#]+)#(\d{2}\/\d{2}\/\d{4})#(\d{2,13})#([^#]+)#(\d{2,16})$/;
  const match = regex.exec(data);

  if (match) {
    const [, nama, tanggal, nomorHp, email, nik] = match;

    const dateParts = tanggal.split('/');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);

    const isValidDate = !isNaN(day) && !isNaN(month) && !isNaN(year) &&
      day >= 1 && day <= 31 &&
      month >= 1 && month <= 12 &&
      year >= 1900 && year <= 2100;

    if (isValidDate) {
      return {
        isValid: true,
        nama,
        tanggal,
        nomorHp,
        email,
        nik
      };
    } else {
      return {
        isValid: false,
        error: 'Tanggal Anda salah'
      };
    }
  } else {
    return {
      isValid: false,
      error: 'Format tidak sesuai'
    };
  }
}


const { sendQueryResult, sendAnotherFunction, khususDokterPoli, khususPoli, InsertTAantrian, InsertTA_TRS_BOOK_REG, statusMr, kelasRs, kelasCek, kuotaDokter } = require('./config');
      // Mengambil hasil query dari database
  let aT = '';
  sendQueryResult((err, results) => {
    if (err) {
      console.log('Terjadi kesalahan:', err);
      return;
    }
    for (let i = 0; i < results.length; i++) {
      aT += results[i] + ' Whatsapp Chat Boot\n\nSilahkan ketik "*menu*" untuk memulai chat dengan layanan kami ..\n\Terima kasih.';
    }
    // Mengirim pesan ke pengirim pesan terakhir
  });
  let dokter = '';
  let jumDoc ='';
  const cobaba = '';
  sendAnotherFunction(cobaba, (err, results) => {
    if (err) {
      console.log('Terjadi kesalahan:', err);
      return;
    }
    let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
    let isiDoc1 = '';  
    for (let i = 0; i < results.length; i++) {
      let a = i + 1;
      isiDoc1 += ' \nKetik *' + a + '* untuk ' + results[i].fs_nm_peg + '';
      
    }
    
    dokter = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';

    // Berfungsi untuk mencetak di consol terminal
    //console.log('Data poli:', poli);
  });
  let poli = '';
  let jumPol ='';
  khususPoli((err, results) => {
    if (err) {
      console.log('Terjadi kesalahan:', err);
      return;
    }
    let isiP = 'Pilih Poli sesuai dengan keluhan Anda:\n';
    let isiP1 = '';  
    for (let i = 0; i < results.length; i++) {
      let a = i + 1;
      isiP1 += ' \nKetik *' + a + '* untuk *' + results[i].FS_NM_LAYANAN + '*';
      jumPol = a;
    }
  
    poli = isiP + '' + isiP1 + '\n\nKetik *0* untuk kembali ke jenis pembayaran\nKetik *menu* untuk kembali ke menu utama';

    // Berfungsi untuk mencetak di consol terminal
    //console.log('Data poli:', poli);
  });


  let idKelas = [];
  let kelas='';
  kelasRs((err, results) => {
    if (err) {
      console.log('Terjadi kesalahan:', err);
      return;
    }
    let a = 1;
    let isiP = 'Silahkan pilih kelas yang di inginkan :\n\nKetik *1 Semua Kelas*';
    let isiP1 = '';  
    for (let i = 0; i < results.length; i++) {
      a = a + 1;
      isiP1 += ' \nKetik *' + a + ' ' + results[i].FS_NM_KELAS + '*';      
      idKelas.push(results[i].FS_KELAS_BPJS_BRIDGING);
    }
    
    kelas = isiP +  isiP1 + '\n\nKetik *menu* untuk kembali ke menu utama';

    // Berfungsi untuk mencetak di consol terminal
    //console.log('Data poli:', poli);
  });
  
  



let welcomeMsg = `
Selamat datang di Rumah Sakit Graha Juanda Bekasi
\nKetik *1* untuk Cek Jadwal Dokter\nKetik *2* untuk Pendaftaran Online\nKetik *3* untuk Mengetahui Ketersediaan Kamar Rawat Inap\nKetik *4* untuk Mengetahui Informasi dan Lokasi Kami\n\n
Catatan:\n* Pendaftaran Online hanya bisa dilakukan maksimal H-1 sebelumnya.\n* Jika dalam 45 menit tidak ada respon dari bapak/ibu, maka sesi percakapan akan otomatis berakhir sehingga harus mengulang pendaftaran kembali. 
\nKunjungi rsgrahajuanda.co.id untuk informasi lebih lanjut.\n
\nRS Graha Juanda \nKesehatan anda adalah kebangaan kami`;


//welcome
let salah = 'Mohon maaf, saat ini Rumah Sakit Graha Juanda Bekasi tidak dapat menjawab permintaan kamu. Mohon coba beberapa saat lagi.';
//Pembayaran
let pembayaran = 'Pilih jenis pembayaran:\n\nKetik *1* untuk Pribadi\nKetik *2* untuk Asuransi\nKetik *3* untuk Perusahaan\nKetik *4* untuk BPJS\n\nKetik *menu* untuk kembali ke menu utama';
let tanggalBerobat = 'Ketik tanggal berobat format: (DD/MM/YYYY)\nContoh: 10/09/2022\nPendaftaran Buat Janji dengan Dokter hanya bisa dilakukan maksimal H-1 sebelumnya.\nKetik *0* untuk kembali ke pilihan Poli\nKetik *menu* untuk kembali ke menu utama';
let dokterAda = 'Mohon maaf. Pada tanggal dan waktu tersebut, poli/dokter yang Anda pilih tidak tersedia.\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju. \n\nKetik *menu* untuk kembali ke menu utama';
let jamDokter = 'Pilih jam yang tersedia sesuai dokter yang Anda pilih:\n\nKetik *1* untuk 10:00\nKetik *2* untuk 10:00\nKetik *3* untuk 10:00\n\nKetik *0* untuk memilih dokter lain jika Anda tidak menemukan jam yang anda tuju\nKetik *menu* untuk kembali ke menu utama';
let statusBerobat = 'Anda telah memilih :\n\nRumah Sakit Graha Juanda Bekasi\nDokter: dr. A\nPoli: Anak\nTanggal: 10/09/2021\nWaktu: 10:00\n\nKetik *1* untuk melanjutkan pendaftaran\nKetik *menu* untuk kembali ke menu utama';
//pendaftaran Online
let statusPasien = 'Apakah Anda sudah pernah menjadi pasien di Rumah Sakit Graha Juanda Bekasi ?\n\nKetik *1* untuk Pasien Baru\nKetik *2* untuk Pasien Lama\n\nKetik *menu* untuk kembali ke menu utama';
let pasienLama = 'Silakan ketik sesuai format di bawah ini:\n\nNama#Tanggal lahir (DD/MM/YYYY)#No Handphone Pasien#Email Anda#Nomor KTP Anda/Khusus Anak Gunakan KTP Orang Tua\n\ncontoh: Cecep Supriatna#01/08/1956#081800208008#cecep@gmail.com#340407510391008\n\nMohon diperhatikan agar nama, tanggal lahir, nomor hp, dan nomor ktp sesuai dengan yang telah didaftarkan sebelumnya.\n\nMohon diperhatikan agar tidak ada spasi diantara tanda pagar (#).\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk kembali ke menu utama';
let formatSalah = 'Mohon maaf format yang anda masukan salah. Mohon ketik sesuai format di bawah ini:\n\nCecep Supriatna#01/08/1956#081800208008#cecep@gmail.com#340407510391008\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk kembali ke menu utama';
let pasienBaru = 'Silakan kirimkan (upload) foto KTP Anda (Khusus pasien Anak, silakan kirimkan foto KTP orang tua)\nMohon kirimkan foto KTP dengan jelas (tidak berbayang dan tidak buram).\n\nCatatan: Saat ini chatbot belum bisa membaca foto dengan format pdf, doc maupun excel. \nMohon kirimkan foto KTP dengan format berupa foto atau gambar.\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\nKetik *menu* untuk untuk kembali ke menu utama';
let manual = 'Silakan ketik sesuai format di bawah ini:\n\nNama#Tanggal lahir (DD/MM/YYYY)#No Handphone Pasien#Email Anda#Nomor KTP Anda/Khusus Anak Gunakan KTP Orang Tua\ncontoh: Cecep Supriatna#01/08/1956#081800208008#cecep@gmail.com#340407510391008\n\nMohon diperhatikan agar nama, tanggal lahir, nomor hp, dan nomor ktp sesuai dengan yang telah didaftarkan sebelumnya.\nMohon diperhatikan agar tidak ada spasi diantara tanda pagar (#).\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk kembali ke menu utama';
let pembayaran2 = 'Pilih jenis pembayaran:\n\nKetik *1* untuk Pribadi\nKetik *2* untuk Asuransi\nKetik *3* untuk Perusahaan\nKetik *4* untuk BPJS\n\nKetik *0* untuk untuk kembali kategori pasien baru/lama\n\nKetik *menu* untuk kembali ke menu utama';

//Ketersediaan Kamar
let isiKelas = 'Anda Telah memilih Kelas Perawatan Kelas I\n\nKapasitas Tempat Tidur : 10 Bed\nTersedian : 6 Bed\nFasilitas yang disediakan adalah :\n- AC\n- 1 Kamar 1 Tempat Tidur\n- Harga Per Hari : Rp. 650.000.-\n- Wastafel, Shower,  Air Panas\n- Elektrik Bed\n- Central Oksigen\n\nKetik *0* untuk kembali ke pilihan Kelas perawatan\n\nKetik *menu* untuk kembali ke menu utama';
//Informasi
let alamat = 'Rumah Sakit Graha Juanda Bekasi\nJl. Ir. H. Juanda No.326 Bulak Kapal Bekasi Timur\nTelp.021 - 8811832 - Fax.021 - 8834688\nEmail: rsgrahajuanda@gmail.com\n\nLink Google Maps : https://goo.gl/maps/fiy8fmG7c7CzvF6w8\n\nKetik *1* untuk Pendaftaran Online\n\nKetik *0* untuk Kembali ke Menu Utama';




const stateMap = new Map(); // menyimpan state untuk setiap nomor wa
//array nik
let noMr = [];
let nikArray = [];
let namaArray = [];
let noPasien = [];
let nikPasien = [];
let tanggalArray = [];
let tanggalinsert = [];
let emailArray = [];
let kodeBoking = [];

let selectedOptions = [];
let JamDaftar = [];
let JamBerobat = [];
let bulanTa = [];
let jenisPo = [];
let totalDokter = 0;
const menuArray = [];
const menuInputSet = new Set(); 

client.on('message', async (msg) => {
  const message = msg.body;
  const from = msg.from;
  if(message === 'menu'){
    menuArray.push('menu');
    menuInputSet.add(from);
  }
  if(!menuInputSet.has(from)){
    client.sendMessage(from, aT);
    }
  if (!stateMap.has(from)) {
    stateMap.set(from, 'menuUtama');
  }

  let currentState = stateMap.get(from);
  if (currentState === 'menuUtama' && menuInputSet.has(from)) {
      if (message === '1') {
          client.sendMessage(from, pembayaran);
          currentState = 'poli';
        } else if (message === '2') {
          client.sendMessage(from, statusPasien);
          currentState = 'statusPasien';
        } else if (message === '3') {
          client.sendMessage(from, kelas);
          currentState = 'isiKelas';
        } else if (message === '4') {
          client.sendMessage(from, alamat);
          currentState = 'alamat';
        } else if (message === 'menu') {
          client.sendMessage(from, welcomeMsg);
          currentState = 'menuUtama';
        } else {
          client.sendMessage(from, welcomeMsg);
          currentState = 'menuUtama';         
        }
    } else if (currentState === 'poli') {
          if (message === '1') {
            selectedOptions.push({ id: '1', value: 'Pribadi' });             
            selectedOptions[0].value = 'Pribadi'; 
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          } else if (message === '2') {
            selectedOptions.push({ id: '1', value: 'Asuransi' });             
            selectedOptions[0].value = 'Asuransi'; 
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          } else if (message === '3') {
            selectedOptions.push({ id: '1', value: 'Perusahaan' });             
            selectedOptions[0].value = 'Perusahaan'; 
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          } else if (message === '4') {
            selectedOptions.push({ id: '1', value: 'BPJS' });             
            selectedOptions[0].value = 'BPJS'; 
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          }else if (message === 'menu') {
            client.sendMessage(from,welcomeMsg);
            currentState = 'menuUtama';
          } else {            
          client.sendMessage(from, pembayaran);
          currentState = 'poli';
          }
    } else if (currentState === 'tanggalBerobat') {
          if (message >= '1' && message <= jumPol) {            
            khususPoli((err, results) => {              
            selectedOptions.push({ id: '2', value: results[message-1].FS_NM_LAYANAN });             
            selectedOptions[1].value = results[message - 1].FS_NM_LAYANAN; 
            });            
            client.sendMessage(from, tanggalBerobat);
            currentState = 'dokter';
          }else if (message === 'menu') {
            client.sendMessage(from,welcomeMsg);
            currentState = 'menuUtama';
          }else if (message === '0') {
            client.sendMessage(from, pembayaran);
            currentState = 'poli';
          } else {
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          }
    } else if (currentState === 'dokter') {
          function isValidDate(dateString) {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!regex.test(dateString)) {
              return false;
            }
            
            const [day, month, year] = dateString.split('/');
            const date = new Date(year, month - 1, day);
            return (
              date.getDate() === Number(day) &&
              date.getMonth() === month - 1 &&
              date.getFullYear() === Number(year)
            );
          }
          const tanggalObj = new Date();
          const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][tanggalObj.getDay()];
          const tanggal = tanggalObj.getDate();
          const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][tanggalObj.getMonth()];
          const tahun = tanggalObj.getFullYear();
          const tanggalString = `${hari}, ${tanggal} - ${bulan} - ${tahun}`;
          const tanggalIn = message;
          jenisPo = [];                      
          bulanTa = [];      
          totalDokter = 0;

          
          if (isValidDate(tanggalIn)) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Mengatur waktu saat ini ke tengah malam
            const tanggalParts = tanggalIn.split('/');
            const tanggalObj = new Date(tanggalParts[2], tanggalParts[1] - 1, tanggalParts[0]);
            const tanggalObj2 = `${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`; 
            
            if (tanggalObj.getTime() > currentDate.getTime()) {
              const tanggalString = `${tanggalObj.toLocaleString('id-ID', { weekday: 'long' })}, ${tanggalObj.getDate()} - ${tanggalObj.toLocaleString('id-ID', { month: 'long' })} - ${tanggalObj.getFullYear()}`;
              selectedOptions.push({ id: '3', value: tanggalString });      
              selectedOptions[2].value = tanggalString; 
              const jenisPoli = selectedOptions[1].value; 
              const bulanTahun = tanggalIn; 
              jenisPo.push(jenisPoli);
              bulanTa.push(bulanTahun);
              tanggalinsert.push(bulanTahun);
              let dokterPoli='';
              console.log('ini anak poli*'+ jenisPoli+bulanTahun);
              khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {                 
                let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
                let isiDoc1 = '';  
                for (let i = 0; i < results.length; i++) {
                  let a = i + 1;
                  isiDoc1 += ' \nKetik *' + a + '* untuk *' + results[i].FS_NM_PEG + '*';
                  totalDokter = a;
                }
                
                dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';
                if(totalDokter == 0){                  
                  client.sendMessage(from, 'Maaf Dokter Yang anda Pilih Tidak Tersedia\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama');
                  }else{
                  client.sendMessage(from, dokterPoli);
                }
                }); 
                
              currentState = 'jamDokter';              
                // const cobaba = tanggalObj2;
                // sendAnotherFunction(jenisPoli, bulanTahun, cobaba, (err, results) => {});
            } else {
              client.sendMessage(from, tanggalBerobat);
              currentState = 'dokter';
            }
          } else if (message === 'menu') {
            client.sendMessage(from, welcomeMsg);
            currentState = 'menuUtama';
          } else if (message === '0') {
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          } else {
            client.sendMessage(from, tanggalBerobat);
            currentState = 'dokter';
          }

    } else if (currentState === 'dokterAda') {
          if (message === '1') {
            client.sendMessage(from, dokter);
            currentState = 'jamDokter'; 
          }else if (message === 'menu') {
            client.sendMessage(from,welcomeMsg);
            currentState = 'menuUtama';
          }else if (message === '0') {
            client.sendMessage(from, poli);
            currentState = 'tanggalBerobat';
          } else {
            client.sendMessage(from, 'Pilihan tidak valid');
          }
    } else if (currentState === 'jamDokter') {
      
          if (message >= '1' && message <= totalDokter && totalDokter != 0) {     
            let isiMesage = message - 1;            
            let aJ = 0;
            JamDaftar = [];            
            const jenisPoli = jenisPo[0]; 
            const bulanTahun = bulanTa[0];
            khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {
              selectedOptions.push({ id: '4', value: results[isiMesage].FS_NM_PEG });            
              selectedOptions[3].value = results[isiMesage].FS_NM_PEG; 
            // client.sendMessage(from, selectedOptions[3].value);
              if (results[isiMesage].FS_MULAI != '') {
                const waktu1 = results[isiMesage].FS_MULAI;
                const waktu2 = results[isiMesage].FS_AKHIR;
                console.log(waktu2);
                const [jamAwal, menitAwal] = waktu1.split(":");
                const [jamAkhir, menitAkhir] = waktu2.split(":");

                const intervalMenit = 15;
                const jamAwalNumber = parseInt(jamAwal);
                const jamAkhirNumber = parseInt(jamAkhir);
                const menitAwalNumber = parseInt(menitAwal);
                const menitAkhirNumber = parseInt(menitAkhir);

                let isiJ = 'Pilih jam yang tersedia sesuai dokter yang Anda pilih:\n';
                let isiJ1 = '';
                for (let jam = jamAwalNumber; jam <= jamAkhirNumber; jam++) {
                  let menitMulai = 0;
                  if (jam === jamAwalNumber) {
                    menitMulai = Math.ceil(menitAwalNumber / intervalMenit) * intervalMenit;
                  }
                  let menitAkhirLoop = 59;
                  if (jam === jamAkhirNumber) {
                    menitAkhirLoop = Math.floor(menitAkhirNumber / intervalMenit) * intervalMenit;
                  }
                  for (let menit = menitMulai; menit <= menitAkhirLoop; menit += intervalMenit) {
                    const jamFormatted = String(jam).padStart(2, '0');
                    const menitFormatted = String(menit).padStart(2, '0');
                    const waktu = `${jamFormatted}:${menitFormatted}`;
                    aJ = aJ + 1;

                    // Lakukan sesuatu dengan waktu, misalnya kirim pesan
                    isiJ1 += '\nKetik *' + aJ + '* untuk ' + waktu;
                    JamDaftar.push(waktu); // Menambahkan jam ke dalam array JamDaftar
                  }
                }
                let isimessage='';
                client.sendMessage(from, isiJ + isiJ1 + '\n\nKetik *0* untuk memilih dokter lain jika Anda tidak menemukan jam yang Anda tuju\nKetik *menu* untuk kembali ke menu utama');
              } else {
                client.sendMessage(from, 'Dokter tidak tersedia');
              }
            });
            currentState = 'statusBerobat';
          }else if (message === 'menu') {
            client.sendMessage(from,welcomeMsg);
            currentState = 'menuUtama';
          }else if (message === '0') {
            client.sendMessage(from, tanggalBerobat);
            currentState = 'dokter';
          } else {            
            const jenisPoli = jenisPo[0]; 
            const bulanTahun = bulanTa[0];
            khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {               
                            
              let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
              let isiDoc1 = '';  
              for (let i = 0; i < results.length; i++) {
                let a = i + 1;
                isiDoc1 += ' \nKetik *' + a + '* untuk ' + results[i].FS_NM_PEG + '';
                totalDokter = a;
              }
              
              dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';

              client.sendMessage(from, dokterPoli);
              });
            currentState = 'jamDokter';       
          }
    } else if (currentState === 'statusBerobat') {
          const count = JamDaftar.length;
          let du=0;
          if (message >= '1' && message <= count) {
            client.sendMessage(from, count);
            client.sendMessage(from, 'Jadwal Dokter Ditemukan :\n\nRumah Sakit Graha Juanda Bekasi\nDokter: *'+ selectedOptions[3].value +'*\nPoli: *'+ selectedOptions[1].value +'*\nTanggal: *'+ selectedOptions[2].value +'*\nWaktu: *'+JamDaftar[message-1]+'*\n\nKetik *1* untuk melanjutkan pendaftaran\nKetik *menu* untuk kembali ke menu utama');
            selectedOptions.push({ id: '5', value: JamDaftar[message-1] });              
          JamBerobat.push(JamDaftar[message-1]); 
            currentState = 'statusS';
          } else if (message === 'menu') {
            client.sendMessage(from, welcomeMsg);
            currentState = 'menuUtama';
          } else if (message === '0') {
            const jenisPoli = jenisPo[0]; 
            const bulanTahun = bulanTa[0];
            khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {                 
              let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
              let isiDoc1 = '';  
              for (let i = 0; i < results.length; i++) {
                let a = i + 1;
                isiDoc1 += ' \nKetik *' + a + '* untuk *' + results[i].FS_NM_PEG + '*';
                totalDokter = a;
              }
              
              dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';
              if(totalDokter == 0){                  
                client.sendMessage(from, 'Maaf Dokter Yang anda Pilih Tidak Tersedia\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama');
                }else{
                client.sendMessage(from, dokterPoli);
              }
              }); 
            currentState = 'jamDokter';
          } else {
            let aJ = 0;
                let isiJ = 'Pilih jam yang tersedia sesuai dokter yang Anda pilidiofoeh:\n';
                let isiJ1 = '';
                for (let i = 0; i < JamDaftar.length; i++) {
                  aJ = aJ + 1;
                  isiJ1 += '\nKetik *' + aJ + '* untuk ' + JamDaftar[i];
                  console.log(JamDaftar[i]);
                }
                client.sendMessage(from, isiJ + isiJ1 + '\n\nKetik *0* untuk memilih dokter lain jika Anda tidak menemukan jam yang Anda tuju\nKetik *menu* untuk kembali ke menu utama');
          currentState = 'statusBerobat';
          }

    } else if (currentState === 'statusS') {
      if (message === '1') {
        client.sendMessage(from, statusPasien);
        currentState = 'statusPasien3';
      }else if (message === 'menu') {
        client.sendMessage(from,welcomeMsg);
        currentState = 'menuUtama';
      } else {
        client.sendMessage(from, 'Anda telah memilih :\n\nRumah Sakit Graha Juanda Bekasi\nDokter: *'+ selectedOptions[3].value +'*\nPoli: *'+ selectedOptions[1].value +'*\nTanggal: *'+ selectedOptions[2].value +'*\nWaktu: *'+selectedOptions[4].value+'*\n\nKetik *1* untuk melanjutkan pendaftaran\nKetik *menu* untuk kembali ke menu utama');
        currentState = 'statusS';
      }

    } else if (currentState === 'statusPasien3') {    
      // client.sendMessage(from, 'ini adalah hal ke 2 1');
      if (message === '1') {
        client.sendMessage(from, manual);
        currentState = 'manual3';
      }else if (message === '2') {
        client.sendMessage(from, manual);
        currentState = 'manual3';
      }else if (message === 'menu') {
        client.sendMessage(from,welcomeMsg);
        currentState = 'menuUtama';
      } else {
        client.sendMessage(from, statusPasien);
        currentState = 'statusPasien3';
      }
    } else if (currentState === 'manual3') {
      // client.sendMessage(from, 'ini adalah hal ke 2 4');
        const data = message;
        const validation = validateFormat(data);
    
        if (validation.isValid) { 
          nikArray.push(validation.nik ); 
          noPasien.push(validation.nomorHp); 
          namaArray.push(validation.nama); 
          tanggalArray.push(validation.tanggal ); 
          emailArray.push(validation.email );
          const dataMr = {
            nikArray: validation.nik ,
            noPasien: validation.nomorHp ,
            namaArray: validation.nama,
            tanggalArray: validation.tanggal  
          };
          noMr.push('');
          statusMr(dataMr, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            let mR ='';
            if(result == ''){
              mR ='Data Anda tidak ditemukan di Rekam Medik, anda dikategorikan pasien baru\n\n';
              // mR ='';
            }else{
              mR1 ='Data di Rekam Medik ditemukan dalam database kami\n\n';
              mR =mR1 +'Nomor Mr : *'+ result +'*\n';
              noMr.push(result);
            }
            const isiData = `Data yang Kami dapatkan berdasarkan Inputan anda adalah :\n\n${mR}NIK : ${validation.nik}\nNama : ${validation.nama}\nTanggal Lahir : ${validation.tanggal}\nEmail : ${validation.email}\n\nKetik *1* untuk Data Sudah Benar\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk ke menu utama`;
            client.sendMessage(from, isiData);
            console.log('Data berhasil dimasukkan ke dalam tabel Mr', result);
          });
    
          currentState = 'konfirmasiData3';     
        }else if (message === 'menu') {
          client.sendMessage(from,welcomeMsg);
          currentState = 'menuUtama';
        }else if (message === '0') {
          client.sendMessage(from,statusPasien);
          currentState = 'statusPasien3';
        } else {
          client.sendMessage(from, manual);
          currentState = 'manual3';
        }
      } else if (currentState === 'konfirmasiData3') {
        
        // client.sendMessage(from, 'ini adalah hal ke 2 g');
        
        console.log('ini isi dan');
            for (let i = 0; i < selectedOptions.length; i++) {
              console.log(selectedOptions[i]);
            }
            let nomorMr ='';
            if(noMr[noMr.length - 1] == ''){
              nomorMr ='';
            }else{              
              nomorMr ='Nomor Mr : *'+ noMr[noMr.length - 1]+'*\n';
            }
            let konfirmasiData = 'Terima kasih atas pendaftarannya, mohon konfirmasi terkait dengan data-data Anda sebagai berikut:\n\n'+nomorMr+'Nama : *'+namaArray[namaArray.length - 1]+'*\nTanggal Lahir : *'+tanggalArray[tanggalArray.length - 1]+'*\nDokter : *'+selectedOptions[3].value+'*\nPoli : *'+selectedOptions[1].value+'*\nTanggal : *'+selectedOptions[2].value+'*\nWaktu : *'+JamBerobat[JamBerobat.length - 1]+'*\nJenis Pembayaran : *'+selectedOptions[0].value+'*\n\nKetik *1* jika data sudah benar\nKetik *2* untuk merubah data';
          if (message === '1') {
            client.sendMessage(from, konfirmasiData);
            currentState = 'statusOn';
          }else if (message === 'menu') {
            client.sendMessage(from,welcomeMsg);
            currentState = 'menuUtama';
          }else if (message === '0') {
            client.sendMessage(from,statusPasien);
            currentState = 'statusPasien3';
          } else {
            const dataMr = {
              nikArray: nikArray[nikArray.length - 1] ,
              noPasien: noPasien[noPasien.length - 1],
              namaArray: namaArray[namaArray.length - 1],
              tanggalArray: tanggalArray[tanggalArray.length - 1]  
            };
            
            statusMr(dataMr, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              let mR ='';
              if(result == ''){
                mR ='Data Anda tidak ditemukan di Rekam Medik, anda dikategorikan pasien baru\n\n';
                // mR ='';
              }else{
                mR1 ='Data di Rekam Medik ditemukan dalam database kami\n\n';
                mR =mR1 +'Nomor Mr : *'+ result +'*\n';
                noMr.push(result);
              }
              const isiData = `Data yang Kami dapatkan berdasarkan Inputan anda adalah :\n\n${mR}NIK : ${nikArray}\nNama : ${namaArray}\nTanggal Lahir : ${tanggalArray}\nEmail : ${emailArray}\n\nKetik *1* untuk Data Sudah Benar\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk ke menu utama`;
              client.sendMessage(from, isiData);
              console.log('Data berhasil dimasukkan ke dalam tabel Mr', result);
            });
            currentState = 'konfirmasiData3';
          }


    // halaman 2

  } else if (currentState === 'statusPasien') {    
    // client.sendMessage(from, 'ini adalah hal ke 2 1');
    if (message === '1') {
      client.sendMessage(from, manual);
      currentState = 'manual';
    }else if (message === '2') {
      client.sendMessage(from, manual);
      currentState = 'manual';
    }else if (message === 'menu') {
      client.sendMessage(from,welcomeMsg);
      currentState = 'menuUtama';
    } else {
      client.sendMessage(from, statusPasien);
      currentState = 'statusPasien';
    }
} else if (currentState === 'manual') {
  // client.sendMessage(from, 'ini adalah hal ke 2 4');
    const data = message;
    const validation = validateFormat(data);

    if (validation.isValid) { 
      nikArray.push(validation.nik); 
      noPasien.push(validation.nomorHp); 
      namaArray.push(validation.nama); 
      tanggalArray.push(validation.tanggal ); 
      emailArray.push(validation.email );
      const dataMr = {
        nikArray: validation.nik ,
        noPasien: validation.nomorHp ,
        namaArray: validation.nama,
        tanggalArray: validation.tanggal  
      };
      noMr.push('');
      
      statusMr(dataMr, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        let mR ='';
        if(result == ''){          
          mR ='Data Anda tidak ditemukan di Rekam Medik, anda dikategorikan pasien baru\n\n';
        }else{          
          mR1 ='Data di Rekam Medik ditemukan dalam database kami\n\n';
          mR =mR1 +'Nomor Mr : *'+ result +'*\n';
          noMr.push(result);
        }
        const isiData = `Data yang Kami dapatkan berdasarkan Inputan anda adalah :\n\n${mR}NIK : ${validation.nik}\nNama : ${validation.nama}\nTanggal Lahir : ${validation.tanggal}\nEmail : ${validation.email}\n\nKetik *1* untuk Data Sudah Benar\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk ke menu utama`;
        client.sendMessage(from, isiData);
        console.log('Data berhasil dimasukkan ke dalam tabel Mr', result);
      });

      currentState = 'pembayaran2';     
    }else if (message === 'menu') {
      client.sendMessage(from,welcomeMsg);
      currentState = 'menuUtama';
    }else if (message === '0') {
      client.sendMessage(from,statusPasien);
      currentState = 'statusPasien';
    } else {
      client.sendMessage(from, manual);
      currentState = 'manual';
    }
} else if (currentState === 'datapasienBaru') {
  // client.sendMessage(from, 'ini adalah hal ke 2 3');
    if (message === '1') {
      client.sendMessage(from, manual);
      currentState = 'manual';
    } else if (message === '2') {
      client.sendMessage(from, pembayaran2);
      currentState = 'poli2';
    } else if (message === '3') {
      client.sendMessage(from, pasienBaru);
      currentState = 'pasienBaru';
    }else if (message === 'menu') {
      client.sendMessage(from, welcomeMsg);
      currentState = 'menuUtama';
    }else if (message === '0') {
      client.sendMessage(from, statusPasien);
      currentState = 'statusPasien';
    } else {
      client.sendMessage(from, datapasienBaru);
      currentState = 'datapasienBaru';
    }
} else if (currentState === 'pembayaran2') {
      for (let i = 0; i < selectedOptions.length; i++) {
        console.log(selectedOptions[i]);
      }      
      // client.sendMessage(from, 'ini adalah hal ke 2 a');
    if (message === '1') {
      client.sendMessage(from, pembayaran2);
      currentState = 'poli2';
    }else if (message === 'menu') {
      client.sendMessage(from,welcomeMsg);
      currentState = 'menuUtama';
    }else if (message === '0') {
      client.sendMessage(from,statusPasien);
      currentState = 'statusPasien';
    } else {
      client.sendMessage(from, 'Data yang Kami dapatkan berdasarkan Inputan anda adalah :\n\nNIK : *'+nikArray[nikArray.length - 1]+'*\nNama : *'+namaArray[namaArray.length - 1]+'*\nTanggal Lahir : *'+tanggalArray[tanggalArray.length - 1]+'*\nEmail : *'+emailArray[emailArray.length - 1]+'*\n\nKetik *1* untuk Data Sudah Benar\n\nKetik *0* untuk memilih kembali kategori pasien baru/lama\n\nKetik *menu* untuk ke menu utama');
      currentState = 'pembayaran2';
    }
} else if (currentState === 'poli2') {
  // client.sendMessage(from, 'ini adalah hal ke 2 b');
  if (message === '1') {
          selectedOptions.push({ id: '1', value: 'Pribadi' });             
          selectedOptions[0].value = 'Pribadi'; 
          client.sendMessage(from, poli);
          currentState = 'tanggalBerobat2';
        } else if (message === '2') {
          selectedOptions.push({ id: '1', value: 'Asuransi' });             
          selectedOptions[0].value = 'Asuransi'; 
          client.sendMessage(from, poli);
          currentState = 'tanggalBerobat2';
        } else if (message === '3') {
          selectedOptions.push({ id: '1', value: 'Perusahaan' });             
          selectedOptions[0].value = 'Perusahaan'; 
          client.sendMessage(from, poli);
          currentState = 'tanggalBerobat2';
        } else if (message === '4') {
          selectedOptions.push({ id: '1', value: 'BPJS' });             
          selectedOptions[0].value = 'BPJS'; 
          client.sendMessage(from, poli);
          currentState = 'tanggalBerobat2';
        }else if (message === 'menu') {
          client.sendMessage(from,welcomeMsg);
          currentState = 'menuUtama';
        }else if (message === '0') {
          client.sendMessage(from, statusPasien);
          currentState = 'statusPasien';
        } else {            
          client.sendMessage(from, pembayaran2);
          currentState = 'poli2';
        }
} else if (currentState === 'tanggalBerobat2') {
  
  // client.sendMessage(from, 'ini adalah hal ke 2 c');
        if (message >= '1' && message <= jumPol) {            
          khususPoli((err, results) => {              
          selectedOptions.push({ id: '2', value: results[message-1].FS_NM_LAYANAN });             
          selectedOptions[1].value = results[message - 1].FS_NM_LAYANAN; 
          });            
          client.sendMessage(from, tanggalBerobat);
          currentState = 'dokter2';
        }else if (message === 'menu') {
          client.sendMessage(from,welcomeMsg);
          currentState = 'menuUtama';
        }else if (message === '0') {
          client.sendMessage(from, pembayaran2);
          currentState = 'poli2';
        } else {
          client.sendMessage(from, poli);
          currentState = 'tanggalBerobat2';
        }
} else if (currentState === 'dokter2') {
  // client.sendMessage(from, 'ini adalah hal ke 2 d');
  function isValidDate(dateString) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === Number(day) &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === Number(year)
    );
  }
  const tanggalObj = new Date();
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][tanggalObj.getDay()];
  const tanggal = tanggalObj.getDate();
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][tanggalObj.getMonth()];
  const tahun = tanggalObj.getFullYear();
  const tanggalString = `${hari}, ${tanggal} - ${bulan} - ${tahun}`;
  const tanggalIn = message;
  jenisPo = [];                      
  bulanTa = [];      
  totalDokter = 0;

  
  if (isValidDate(tanggalIn)) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Mengatur waktu saat ini ke tengah malam
    const tanggalParts = tanggalIn.split('/');
    const tanggalObj = new Date(tanggalParts[2], tanggalParts[1] - 1, tanggalParts[0]);
    const tanggalObj2 = `${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`; 
    
    if (tanggalObj.getTime() > currentDate.getTime()) {
      const tanggalString = `${tanggalObj.toLocaleString('id-ID', { weekday: 'long' })}, ${tanggalObj.getDate()} - ${tanggalObj.toLocaleString('id-ID', { month: 'long' })} - ${tanggalObj.getFullYear()}`;
      selectedOptions.push({ id: '3', value: tanggalString });      
      selectedOptions[2].value = tanggalString; 
      const jenisPoli = selectedOptions[1].value; 
      const bulanTahun = tanggalIn; 
      jenisPo.push(jenisPoli);
      bulanTa.push(bulanTahun);
      tanggalinsert.push(bulanTahun);
      let dokterPoli='';
      console.log('ini anak poli*'+ jenisPoli+bulanTahun);
      khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {                 
        let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
        let isiDoc1 = '';  
        for (let i = 0; i < results.length; i++) {
          let a = i + 1;
          isiDoc1 += ' \nKetik *' + a + '* untuk *' + results[i].FS_NM_PEG + '*';
          totalDokter = a;
        }
        
        dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';
        if(totalDokter == 0){                  
          client.sendMessage(from, 'Maaf Dokter Yang anda Pilih Tidak Tersedia\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama');
          }else{
          client.sendMessage(from, dokterPoli);
        }
        }); 
        
      currentState = 'jamDokter2';              
        // const cobaba = tanggalObj2;
        // sendAnotherFunction(jenisPoli, bulanTahun, cobaba, (err, results) => {});
    } else {
      client.sendMessage(from, tanggalBerobat);
      currentState = 'dokter2';
    }
  } else if (message === 'menu') {
    client.sendMessage(from, welcomeMsg);
    currentState = 'menuUtama';
  } else if (message === '0') {
    client.sendMessage(from, poli);
    currentState = 'tanggalBerobat2';
  } else {
    client.sendMessage(from, tanggalBerobat);
    currentState = 'dokter2';
  }
} else if (currentState === 'jamDokter2') {
  // client.sendMessage(from, 'ini adalah hal ke 2 e');
  if (message >= '1' && message <= totalDokter && totalDokter != 0) {     
    let isiMesage = message - 1;            
    let aJ = 0;
    JamDaftar = [];            
    const jenisPoli = jenisPo[0]; 
    const bulanTahun = bulanTa[0];
    khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {
      selectedOptions.push({ id: '4', value: results[isiMesage].FS_NM_PEG });            
      selectedOptions[3].value = results[isiMesage].FS_NM_PEG; 
    // client.sendMessage(from, selectedOptions[3].value);
      if (results[isiMesage].FS_MULAI != '') {
        const waktu1 = results[isiMesage].FS_MULAI;
        const waktu2 = results[isiMesage].FS_AKHIR;
        console.log(waktu2);
        const [jamAwal, menitAwal] = waktu1.split(":");
        const [jamAkhir, menitAkhir] = waktu2.split(":");

        const intervalMenit = 15;
        const jamAwalNumber = parseInt(jamAwal);
        const jamAkhirNumber = parseInt(jamAkhir);
        const menitAwalNumber = parseInt(menitAwal);
        const menitAkhirNumber = parseInt(menitAkhir);

        let isiJ = 'Pilih jam yang tersedia sesuai dokter yang Anda pilih:\n';
        let isiJ1 = '';
        for (let jam = jamAwalNumber; jam <= jamAkhirNumber; jam++) {
          let menitMulai = 0;
          if (jam === jamAwalNumber) {
            menitMulai = Math.ceil(menitAwalNumber / intervalMenit) * intervalMenit;
          }
          let menitAkhirLoop = 59;
          if (jam === jamAkhirNumber) {
            menitAkhirLoop = Math.floor(menitAkhirNumber / intervalMenit) * intervalMenit;
          }
          for (let menit = menitMulai; menit <= menitAkhirLoop; menit += intervalMenit) {
            const jamFormatted = String(jam).padStart(2, '0');
            const menitFormatted = String(menit).padStart(2, '0');
            const waktu = `${jamFormatted}:${menitFormatted}`;
            aJ = aJ + 1;

            // Lakukan sesuatu dengan waktu, misalnya kirim pesan
            isiJ1 += '\nKetik *' + aJ + '* untuk ' + waktu;
            JamDaftar.push(waktu); // Menambahkan jam ke dalam array JamDaftar
          }
        }
        let isimessage='';
        client.sendMessage(from, isiJ + isiJ1 + '\n\nKetik *0* untuk memilih dokter lain jika Anda tidak menemukan jam yang Anda tuju\nKetik *menu* untuk kembali ke menu utama');
      } else {
        client.sendMessage(from, 'Dokter tidak tersedia');
      }
    });
    currentState = 'statusBerobat2';
  }else if (message === 'menu') {
    client.sendMessage(from,welcomeMsg);
    currentState = 'menuUtama';
  }else if (message === '0') {
    client.sendMessage(from, tanggalBerobat);
    currentState = 'dokter2';
  } else {            
    const jenisPoli = jenisPo[0]; 
    const bulanTahun = bulanTa[0];
    khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {               
                    
      let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
      let isiDoc1 = '';  
      for (let i = 0; i < results.length; i++) {
        let a = i + 1;
        isiDoc1 += ' \nKetik *' + a + '* untuk ' + results[i].FS_NM_PEG + '';
        totalDokter = a;
      }
      
      dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';
      if(totalDokter == 0){                  
        client.sendMessage(from, 'Maaf Dokter Yang anda Pilih Tidak Tersedia\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama');
        }else{
        client.sendMessage(from, dokterPoli);
      }
      });
    currentState = 'jamDokter2';       
  }
} else if (currentState === 'statusBerobat2') {
  // client.sendMessage(from, 'ini adalah hal ke 2 f');
  const count = JamDaftar.length;
  let du=0;
  if (message >= '1' && message <= count) {
    client.sendMessage(from, 'Anda telah memilih :\n\nRumah Sakit Graha Juanda Bekasi\nDokter : *'+ selectedOptions[3].value +'*\nPoli : *'+ selectedOptions[1].value +'*\nTanggal : *'+ selectedOptions[2].value +'*\nWaktu : *'+JamDaftar[message-1]+'*\n\nKetik *1* untuk melanjutkan pendaftaran\nKetik *menu* untuk kembali ke menu utama');
    selectedOptions.push({ id: '5', value: JamDaftar[message-1] }); 
    JamBerobat.push(JamDaftar[message]);
    currentState = 'konfirmasiData';
  } else if (message === 'menu') {
    client.sendMessage(from, welcomeMsg);
    currentState = 'menuUtama';
  } else if (message === '0') {
    const jenisPoli = jenisPo[0]; 
            const bulanTahun = bulanTa[0];
            khususDokterPoli(jenisPoli, bulanTahun, (err, results) => {                 
              let isiDoc = 'Pilih dokter yang tersedia sesuai tanggal yang Anda pilih:\n';
              let isiDoc1 = '';  
              for (let i = 0; i < results.length; i++) {
                let a = i + 1;
                isiDoc1 += ' \nKetik *' + a + '* untuk *' + results[i].FS_NM_PEG + '*';
                totalDokter = a;
              }
              
              dokterPoli = isiDoc + '' + isiDoc1 + '\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama';
              if(totalDokter == 0){                  
                client.sendMessage(from, 'Maaf Dokter Yang anda Pilih Tidak Tersedia\n\nKetik *0* untuk memilih tanggal atau jadwal dokter lainnya jika Anda tidak menemukan dokter yang Anda tuju.\n\nKetik *menu* untuk kembali ke menu utama');
                }else{
                client.sendMessage(from, dokterPoli);
              }
              }); 
    currentState = 'jamDokter2';
  } else {
    let aJ = 0;
        let isiJ = 'Pilih jam yang tersedia sesuai dokter yang Anda pilih:\n';
        let isiJ1 = '';
        for (let i = 0; i < JamDaftar.length; i++) {
          aJ = aJ + 1;
          isiJ1 += '\nKetik *' + aJ + '* untuk ' + JamDaftar[i];
          console.log(JamDaftar[i]);
        }
        client.sendMessage(from, isiJ + isiJ1 + '\n\nKetik *0* untuk memilih dokter lain jika Anda tidak menemukan jam yang Anda tuju\nKetik *menu* untuk kembali ke menu utama');
  currentState = 'statusBerobat2';
  }
} else if (currentState === 'konfirmasiData') {
  // client.sendMessage(from, 'ini adalah hal ke 2 g');
  console.log('ini isi dan');
      for (let i = 0; i < selectedOptions.length; i++) {
        console.log(selectedOptions[i]);
      }
      let nomorMr ='';
      if(noMr[noMr.length - 1] != ''){
        nomorMr ='Nomor Mr : *'+ noMr[noMr.length - 1]+'*\n';
      }
      let konfirmasiData = 'Terima kasih atas pendaftarannya, mohon konfirmasi terkait dengan data-data Anda sebagai berikut:\n\n'+nomorMr+'Nama : *'+namaArray[namaArray.length - 1]+'*\nTanggal Lahir : *'+tanggalArray[tanggalArray.length - 1]+'*\nDokter : *'+selectedOptions[3].value+'*\nPoli : *'+selectedOptions[1].value+'*\nTanggal : *'+selectedOptions[2].value+'*\nWaktu : *'+JamBerobat[JamBerobat.length - 1]+'*\nJenis Pembayaran : *'+selectedOptions[0].value+'*\n\nKetik *1* jika data sudah benar\nKetik *2* untuk merubah data';
    if (message === '1') {
      client.sendMessage(from, konfirmasiData);
      currentState = 'statusOn';
    }else if (message === 'menu') {
      client.sendMessage(from,welcomeMsg);
      currentState = 'menuUtama';
    } else {
      client.sendMessage(from, 'Anda telah memilih  :\n\nRumah Sakit Graha Juanda Bekasi\nDokter : *'+ selectedOptions[3].value +'*\nPoli : *'+ selectedOptions[1].value +'*\nTanggal : *'+ selectedOptions[2].value +'*\nWaktu : *'+JamBerobat[JamBerobat.length - 1]+'*\n\nKetik *1* untuk melanjutkan pendaftaran\nKetik *menu* untuk kembali ke menu utama');
      currentState = 'konfirmasiData';
    }
} else if (currentState === 'statusOn') {
  // client.sendMessage(from, 'ini adalah hal ke 2 h');
  let nilaiTerakhir = tanggalinsert[tanggalinsert.length - 1];
  const data = {
    noMr :noMr[noMr.length - 1],
    Idpoli: selectedOptions[1].value,
    dokter: selectedOptions[3].value,
    tglbooking: nilaiTerakhir,
    jampraktek: 0,
    noAntrian: 1,
    jkn: 1
  };let pilihJaminan ='';
  if(selectedOptions[0].value == 'Pribadi' || selectedOptions[0].value == 'Asuransi' || selectedOptions[0].value == 'Perusahaan'){
    pilihJaminan ='001';
  }else{
    pilihJaminan ='JKN';
  }
  

  console.log(nilaiTerakhir);
  const dataBok = {
    Idpoli : selectedOptions[1].value,
    nmpasien : namaArray[namaArray.length - 1],
    noTlp :noPasien[noPasien.length - 1],
    noMr :noMr[noMr.length - 1],
    tglbooking : nilaiTerakhir,
    jambooking : JamBerobat[JamBerobat.length - 1],
    dokter :selectedOptions[3].value,
    jaminan : pilihJaminan,
    jampraktek :JamBerobat[JamBerobat.length - 1],
    noAntrian :'',
    email : emailArray[emailArray.length - 1],
    tgllahir :tanggalArray[tanggalArray.length - 1]
  };
 if (message === '1') {
      kuotaDokter(data,(err, results) => {   
        console.log('ini jdkjjdsks no'+results);    

          if(results >= 1){
            console.log('ini Kuota no1 '+results);
          
          if(noMr[noMr.length - 1] !== ''){
            InsertTAantrian(data, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
            
              console.log('Data berhasil dimasukkan ke dalam tabel TA_ANTRIAN:', result);
            });
          }
          
          setTimeout(() => {
            InsertTA_TRS_BOOK_REG(dataBok, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              
              if(result.noAntrian == undefined || result.noAntrian == ''){
                hasilAntrian = '';
              }else{
                hasilAntrian='\nNo Antrian : *#'+result.noAntrian+'*';
              }
              let statusOn = 'Bapak/Ibu *'+namaArray[namaArray.length - 1]+'*,\nTerima kasih telah melakukan pendaftaran online di Rumah Sakit Graha Juanda Bekasi. Saat ini Anda telah dijadwalkan di:\n\nDokter : *'+selectedOptions[3].value+'*\nPoli : *'+selectedOptions[1].value+'*\nTanggal : *'+selectedOptions[2].value+'*\nWaktu : *'+JamBerobat[JamBerobat.length - 1]+'*'+hasilAntrian+'\n\nDiharapkan kedatangan Anda 15 menit sebelum waktu perjanjian diatas.\n\nKode booking : *'+result.HasilnoReg+'*\n\nBagi Pasien baru silahkan datang ke Counter Pendaftaran untuk mengkonfirmasi Rekam Medis.\n\nBagi Pasien Lama silakan masukan kode booking di mesin Anjungan Pendaftaran Mandiri untuk mencetak nomor antrian dan struk pendaftaran, \n\nkemudian silakan kunjungi poli yang Anda tuju. Khusus untuk pasien BPJS harap membawa kelengkapan kartu BPJS dan surat rujukan. \n\nGunakan masker, selalu rutin mencuci tangan, dan selalu jaga jarak selama berada di area gedung rumah sakit.\n\nTerima kasih,';
              console.log('Data berhasil dimasukkan ke dalam tabel TA_', result.HasilnoReg);
              console.log('Data berhasil dimasukkan ke dalam tabel TA_', result.noAntrian);
              client.sendMessage(from, statusOn);
            });
            
          }, 3000);

        }else{           
          console.log('ini Kuota Penuh '+results);
          client.sendMessage(from, 'Kuota Atau Dokter anda penuh');
          currentState = 'end';
        }
      }); 
      currentState = 'end';

    }else if (message === '2') {
      client.sendMessage(from, statusPasien);
      currentState = 'statusPasien';
    } else {
      let nomorMr ='';
      if(noMr[noMr.length - 1] == ''){
        nomorMr ='';
      }else{              
        nomorMr ='Nomor Mr : *'+ noMr[noMr.length - 1]+'*\n';
      }
      let konfirmasiData = 'Terima kasih atas pendaftarannya, mohon konfirmasi terkait dengan data-data Anda sebagai berikut:\n\n'+nomorMr+'Nama : *'+namaArray[namaArray.length - 1]+'*\nTanggal Lahir : *'+tanggalArray[tanggalArray.length - 1]+'*\nDokter : *'+selectedOptions[3].value+'*\nPoli : *'+selectedOptions[1].value+'*\nTanggal : *'+selectedOptions[2].value+'*\nWaktu : *'+JamBerobat[JamBerobat.length - 1]+'*\nJenis Pembayaran : *'+selectedOptions[0].value+'*\n\nKetik *1* jika data sudah benar\nKetik *2* untuk merubah data';
      client.sendMessage(from, konfirmasiData);
      currentState = 'statusOn';
    } 

// halaman 3

} else if (currentState === 'isiKelas') {

    if (message >= '1' && message <= '9') {
      let ruang = idKelas[message-2];
      console.log('Terjadi ruang ini:', message);
      console.log('Terjadi ruang ini:', ruang);
      kelasCek(ruang, (err, results) => {
        if (err) {
          console.log('Terjadi kesalahan:', err);
          return;
        }
                
        // Concatenate rows into a single string
        let tableText = 'Informasi Ketersediaan Ruangan di RS Graha Juanda\n\n';
        for (let i = 0; i < results.length; i++) {
          tableText += '* Ruang : *'+results[i].namaruang + '*-> Kapasitas :  *' + results[i].kapasitas_bed + '* Bed, Tersedia : *' + results[i].sedia_bed + '* Bed\n';
        }
              
        console.log(tableText);
                
        let text1 ='';
        client.sendMessage(from, tableText+text1);
      });              
      currentState = 'isiKelas';
    }else if (message === 'menu'){
          client.sendMessage(from,welcomeMsg);
          currentState = 'menuUtama';
    } else {
      client.sendMessage(from, welcomeMsg);
      currentState = 'menuUtama';
    }

// halaman 4

} else if (currentState === 'alamat') {
    if (message === '1') {
      client.sendMessage(from, statusPasien);
      currentState = 'statusPasien';
    // }else if (message === 'menu'){
    //       client.sendMessage(from, welcomeMsg);
    //       currentState = 'menuUtama';
    }else if (message === '0') {
      client.sendMessage(from, welcomeMsg);
      currentState = 'menuUtama';
    } else {
      client.sendMessage(from, alamat);
      currentState = 'alamat';
    }
} else if (currentState === 'end') {
  if (message === '1') {
    client.sendMessage(from, welcomeMsg);
    currentState = 'menuUtama';
  }else if (message === '0') {
    client.sendMessage(from, welcomeMsg);
    currentState = 'menuUtama';
  } else {
    client.sendMessage(from, welcomeMsg);
    currentState = 'menuUtama';
  }
}

selectedOptions.forEach(item => {
console.log(item.value);
});

// update state untuk nomor wa
stateMap.set(from, currentState);
});









client.on('message', msg => {
  if (msg.body == 'ikbalyuliyanto') {
    client.sendMessage(msg.from, 'sayangh');
  } 
});

const checkRegisteredNumber = function(number) {
  const isRegistered = client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.get('/send_chat', async (req, res) => {

  const number = phoneNumberFormatter(req.query.nomor_ponsel);
  const message = req.query.pesan;

  client.sendMessage(number, message).then(response => {
    res.send('Terkirim');
  }).catch(err => {
    res.send('Gagal terkirim')
  });
});

server.listen(port, function() {
  console.log('App running on *: ' + port);
});
