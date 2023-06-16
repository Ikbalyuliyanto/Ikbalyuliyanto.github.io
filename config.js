// config.js

const sql = require('msnodesqlv8');
const { DateTime } = require('mssql');

const connectionString = 'Driver={SQL Server Native Client 11.0};Server=10.20.15.90\\SQL2014;Database=GJD;Uid=prg;Pwd=prg;';

let globalNoAntrian = [];
//nama rumahsakit
const sendQueryResult = (callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const query = 'SELECT fs_nm_rs FROM T_PARAMETER';

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => row.fs_nm_rs);
      callback(null, results);

      conn.close();
    });
  });
};
//fungi poli

const sendAnotherFunction = (cobaba,callback) => {
  let tanggalObj2=cobaba;  
  let tgljam=  new Date();
  console.log('Selamat Datang Di WA CHATBOT, ',tgljam);
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const query = `
    select aa.fs_kd_layanan, aa.fs_kd_dokter, fs_nm_layanan, fs_nm_peg, 
    aa.fs_praktek, fs_mulai +'-'+ fs_akhir fs_jam, 
    fs_jam_in = isnull(( select min(fs_jam_in)  
                         from   ta_jadwal_dokter_pre xx 
                         Where  aa.fs_kd_layanan = xX.fs_kd_layanan 
                         and    aa.fs_kd_dokter = xx.fs_kd_dokter 
                         and    aa.fs_praktek = xx.fs_praktek 
                         and    aa.fs_hari = xx.fs_hari 
                         and    xx.fs_status = 'SDH DATANG' 
                         and    xx.fd_tgl_in = '2023-05-23'),'-') , 
     isnull(dd.fs_status,'') fs_status , '' fs_telat 
from    ta_jadwal_dokter_praktek aa 
inner   join td_peg bb on aa.fs_kd_dokter = bb.fs_kd_peg 
inner   join ta_layanan cc on aa.fs_kd_layanan = cc.fs_kd_layanan 
left    join VIEW_JADWAL_DOKTER_PRE_NO dd on aa.fs_kd_layanan = dd.fs_kd_layanan  
         and aa.fs_kd_dokter = dd.fs_kd_dokter 
         and aa.fs_praktek = dd.fs_praktek 
         and aa.fs_hari = dd.fs_hari 
         and dd.fd_tgl_in = '2023-05-23' 
Where   aa.fs_hari = 'SELASA' 
and     fn_tahun = 2023
and     fn_bulan = 5
AND	 cc.FS_NM_LAYANAN = 'BEDAH UMUM POLI' 
order   by fs_nm_layanan, fs_nm_peg 
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => ({
        fs_jam: row.fs_jam,
        fs_nm_peg:row.fs_nm_peg
      }));
      callback(null, results);

      conn.close();
    });
  });
};

const khususPoli = (callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const query = `
    select	aa.FS_NM_LAYANAN 
    from	TA_LAYANAN aa
    inner	join TA_INSTALASI bb on aa.FS_KD_INSTALASI = bb.FS_KD_INSTALASI
    inner	join ( select fs_kd_layanan from TA_JADWAL_DOKTER_PRAKTEK
             group	by FS_KD_LAYANAN
             ) cc on aa.FS_KD_LAYANAN = cc.FS_KD_LAYANAN
    where	bb.FS_KD_INSTALASI_DK = '2'
    order	by FS_NM_LAYANAN
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => ({
        FS_NM_LAYANAN: row.FS_NM_LAYANAN
      }));
      callback(null, results);

      conn.close();
    });
  });
};


const khususDokterPoli = (jenisPoli, bulanTahun, callback) => {
  const tanggalParts = bulanTahun.split('/');
  const tanggalObj = new Date(`${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`);
  const hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'][tanggalObj.getDay()];

  console.log('ini anak poli & hari = '+ jenisPoli+hari+tanggalObj+tanggalParts[2]+tanggalParts[1]+bulanTahun);
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const query = `
      select FS_NM_PEG, aa.FS_PRAKTEK, FS_MULAI, FS_AKHIR
      from TA_JADWAL_DOKTER_PRAKTEK aa
      inner join TA_LAYANAN bb on aa.FS_KD_LAYANAN = bb.FS_KD_LAYANAN
      inner join td_peg cc on aa.FS_KD_DOKTER = cc.fs_kd_peg
      where bb.FS_NM_LAYANAN = '${jenisPoli}'
      and (FN_TAHUN = ${tanggalParts[2]} or fn_tahun = 0)
      and (fn_bulan = ${tanggalParts[1]} or fn_bulan = 0)
      and FS_HARI = '${hari}'
      group by cc.fs_nm_peg, aa.FS_PRAKTEK, aa.FS_MULAI, aa.FS_AKHIR
      order by cc.fs_nm_peg
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => ({
        FS_NM_PEG: row.FS_NM_PEG,
        FS_MULAI: row.FS_MULAI,
        FS_AKHIR: row.FS_AKHIR
      }));
      callback(null, results);

      conn.close();
    });
  });
};



const InsertTA_TRS_BOOK_REG = (dataBok, callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const tanggalParts = dataBok.tglbooking.split('/');
    const tanggalObj = new Date(`${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`);
    const hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'][tanggalObj.getDay()];

    console.log(tanggalObj); // Output: 2023-05-30T00:00:00.000Z
    console.log(hari);

    const query1 = `
      SELECT FS_NM_PEG, aa.FS_KD_LAYANAN, FS_KD_DOKTER, aa.FS_PRAKTEK, FS_MULAI, FS_AKHIR
      FROM TA_JADWAL_DOKTER_PRAKTEK aa
      INNER JOIN TA_LAYANAN bb ON aa.FS_KD_LAYANAN = bb.FS_KD_LAYANAN
      INNER JOIN td_peg cc ON aa.FS_KD_DOKTER = cc.fs_kd_peg
      WHERE bb.FS_NM_LAYANAN = '${dataBok.Idpoli}'
      AND FS_NM_PEG = '${dataBok.dokter}'
      AND (FN_TAHUN = ${tanggalParts[2]} OR fn_tahun = 0)
      AND (fn_bulan = ${tanggalParts[1]} OR fn_bulan = 0)
      AND FS_HARI = '${hari}'
      GROUP BY cc.fs_nm_peg, aa.FS_PRAKTEK, aa.FS_MULAI, aa.FS_AKHIR, aa.FS_KD_LAYANAN, aa.FS_KD_DOKTER 
      ORDER BY cc.fs_nm_peg
    `;

    conn.query(query1, (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const query2 = `
        SELECT MAX(fn_no_booking_reg) AS maxTransaction
        FROM [GJD].[dbo].[t_parameter]
      `;

      conn.query(query2, (err, result2) => {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }

        let noReg1 = 0;
          noReg1 = result2[0].maxTransaction + 1;

        console.log(noReg1);

        let nextTransaction = noReg1;
        let poli = result[0].FS_KD_LAYANAN;
        let dokter = result[0].FS_KD_DOKTER;
        let tanggalBok = tanggalParts[2] + '-' + tanggalParts[1] + '-' + tanggalParts[0];
        let HasilnoReg = 'BK' + String(noReg1).padStart(8, '0');
        let noAntrian = 0;

        const query3 = `
        SELECT MAX(FN_NO_ANTRIAN) AS MaxNoAntrian
        FROM [GJD].[dbo].[TA_ANTRIAN]
        WHERE [FS_KD_LAYANAN] = '${poli}'
          AND [FS_KD_MEDIS] = '${dokter}'
          AND [FD_TGL_ANTRIAN] = '${tanggalBok}'
      `;

      conn.query(query3, (err, result3) => {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }

        console.log('ini hasil di TRS_BOOK Atas ya '+ noAntrian);
        console.log('ini hasil di TRS_BOOK '+ globalNoAntrian[globalNoAntrian.length - 1]);
        console.log('ini hasil di TRS_BOOK Atas ya '+ dataBok.noMr);
        
        if(dataBok.noMr == undefined || dataBok.noMr == null || dataBok.noMr == ''){
          noAntrian = '';
          dataBok.noMr = '';
        console.log('ini hasil di TRS_BOOK bawah ya antri dalam if'+ noAntrian);
        }else{            
          noAntrian = result3[0].MaxNoAntrian;
          console.log('ini hasil di TRS_BOOK else'+ noAntrian);
          if(noAntrian == null || noAntrian == 0){
            noAntrian = '01';
          }else{
            if(noAntrian < 10){
              noAntrian = '0'+result3[0].MaxNoAntrian;
            }else{
              noAntrian = result3[0].MaxNoAntrian;
            }
          }
        console.log('ini hasil di TRS_BOOK bawah ya antri else'+ noAntrian);
        }
        function compareTime(inputTime, compareTimeString) {
          const inputHour = parseInt(inputTime.split(':')[0], 10);
          const inputMinute = parseInt(inputTime.split(':')[1], 10);
        
          const compareHour = parseInt(compareTimeString.split(':')[0], 10);
          const compareMinute = parseInt(compareTimeString.split(':')[1], 10);
        
          if (inputHour > compareHour || (inputHour === compareHour && inputMinute > compareMinute)) {
            return 1;
          } else {
            return 0;
          }
        }
        
        const inputTime = dataBok.jampraktek;
        const compareTimeString = '14:00';        
        const jamprakte = compareTime(inputTime, compareTimeString);
        
        
        console.log('ini hasil di TRS_BOOK bawah ya '+ dataBok.noMr);
        console.log('ini hasil di TRS_BOOK bawah ya antri'+ noAntrian);
        const query4 = `
          INSERT INTO [dbo].[TA_TRS_BOOK_REG]
          ([FS_KD_TRS]
          ,[FD_TGL_TRS]
          ,[FS_JAM_TRS]
          ,[FS_KD_LAYANAN]
          ,[FS_NM_PASIEN]
          ,[FS_NO_TLP]
          ,[FS_MR]
          ,[FB_JENIS_KELAMIN]
          ,[FN_CARA_BOOKING]
          ,[FD_TGL_DATANG]
          ,[FS_JAM_DATANG]
          ,[FS_KD_PEG]
          ,[FS_KD_JAMINAN]
          ,[FS_KD_PETUGAS]
          ,[FS_NO_KARTU_JAMINAN]
          ,[FS_KD_JAMPRAKTEK_BOOK]
          ,[FS_ANTRIAN_BOOK]
          ,[EMAIL]
          ,[FD_TGL_LAHIR_BOOK])
          VALUES
          ('${HasilnoReg}'
          ,CONVERT(char(10), GETDATE(), 126)
          ,convert(varchar(10), GETDATE(), 108)
          ,'${poli}'
          ,'${dataBok.nmpasien}'
          ,'${dataBok.noTlp}'
          ,'${dataBok.noMr}'
          ,0
          ,3
          ,'${tanggalBok}'
          ,'${dataBok.jambooking}'
          ,'${dokter}'
          ,'${dataBok.jaminan}'
          ,'WACHAT'
          ,''
          ,'${jamprakte}'
          ,'${noAntrian}'
          ,'${dataBok.email}'
          ,'${dataBok.tgllahir}')
        `;

        conn.query(query4, (err, result4) => {
          if (err) {
            console.log(err);
            callback(err, null);
            return;
          }          
          const data = {
            HasilnoReg,
            noAntrian,
          };
          
        console.log('ini hasil '+HasilnoReg+' di TRS_BOOK Atas ya '+ noAntrian);

          callback(null, data);
          const updateQuery = `
              UPDATE [GJD].[dbo].[t_parameter]
              SET fn_no_booking_reg = ${nextTransaction}
            `;

            conn.query(updateQuery, (err, result) => {
              if (err) {
                console.log(err);
                callback(err, null);
                return;
              }
          });
        });
      });
      });
    });
  });
};


const InsertTAantrian = (data, callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    const tanggalParts = data.tglbooking.split('/');
    const tanggalObj = new Date(`${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`);
    const hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'][tanggalObj.getDay()];

    console.log(tanggalObj); // Output: 2023-05-30T00:00:00.000Z
    console.log(hari);
    const query1 = `
      SELECT FS_NM_PEG, aa.FS_KD_LAYANAN, FS_KD_DOKTER, aa.FS_PRAKTEK, FS_MULAI, FS_AKHIR
      FROM TA_JADWAL_DOKTER_PRAKTEK aa
      INNER JOIN TA_LAYANAN bb ON aa.FS_KD_LAYANAN = bb.FS_KD_LAYANAN
      INNER JOIN td_peg cc ON aa.FS_KD_DOKTER = cc.fs_kd_peg
      WHERE bb.FS_NM_LAYANAN = '${data.Idpoli}'
      AND FS_NM_PEG = '${data.dokter}'
      AND (FN_TAHUN = ${tanggalParts[2]} OR fn_tahun = 0)
      AND (fn_bulan = ${tanggalParts[1]} OR fn_bulan = 0)
      AND FS_HARI = '${hari}'
      GROUP BY cc.fs_nm_peg, aa.FS_PRAKTEK, aa.FS_MULAI, aa.FS_AKHIR, aa.FS_KD_LAYANAN, aa.FS_KD_DOKTER 
      ORDER BY cc.fs_nm_peg
    `;

    conn.query(query1, (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      let poli = result[0].FS_KD_LAYANAN;
      let dokter = result[0].FS_KD_DOKTER;
      let tanggalBok = tanggalParts[2]+'-'+tanggalParts[1]+'-'+tanggalParts[0];

      const query2 = `
        SELECT MAX(FN_NO_ANTRIAN) AS MaxNoAntrian
        FROM [GJD].[dbo].[TA_ANTRIAN]
        WHERE [FS_KD_LAYANAN] = '${poli}'
          AND [FS_KD_MEDIS] = '${dokter}'
          AND [FD_TGL_ANTRIAN] = '${tanggalBok}'
      `;

      conn.query(query2, (err, result2) => {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }

        let noAntrian = result2[0].MaxNoAntrian;
        if (!noAntrian) {
          noAntrian = 1;
        } else {
          noAntrian++;
        }
        console.log('ini NO ANTRIAN ' +noAntrian);
        let query = '';
        if (data.noMr == undefined) {
          console.log('KOSONGGGG if insert ' +noAntrian);
        }else{
          query = `
            INSERT INTO [dbo].[TA_ANTRIAN]
            ([FS_KD_LAYANAN]
            ,[FS_KD_MEDIS]
            ,[FD_TGL_ANTRIAN]
            ,[FS_KD_JAMPRAKTEK]
            ,[FN_NO_ANTRIAN]
            ,[FB_JKN])
            VALUES
            ('${poli}', '${dokter}', '${tanggalBok}', '${data.jampraktek}', ${noAntrian}, ${data.jkn})
          `;
        console.log('else kesini ' +noAntrian);
        }
        console.log('Ini adalah isi dardar:', poli, dokter, tanggalBok, data.jampraktek, noAntrian, data.jkn);

        conn.query(query, (err, result) => {
          if (err) {
            console.log(err);
            callback(err, null);
            return;
          }

          callback(null, result);

          conn.close();
        });
      });
    });
  });
};

//nama rumahsakit
const statusMr = (dataMr, callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    
    const tanggalParts = dataMr.tanggalArray.split('/');
    const tanggalObj2 = `${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`; 

    const query = `SELECT fs_mr, fs_nm_pasien, fd_tgl_lahir, fs_kd_identitas 
    FROM tc_mr 
    WHERE (fs_nm_pasien LIKE '%${dataMr.namaArray}%' OR fs_kd_identitas LIKE '${dataMr.nikArray}')
    AND fd_tgl_lahir = '${tanggalObj2}';`
    
    console.log('isi Mr' + dataMr.namaArray + dataMr.nikArray + tanggalObj2);

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => row.fs_mr);
      callback(null, results);

      conn.close();
    });
  });
};


const kelasRs = (callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const query = `
      SELECT DISTINCT FS_NM_KELAS, FS_KELAS_BPJS_BRIDGING
      FROM TA_KELAS aa
      INNER JOIN ta_kamar bb ON aa.FS_KD_KELAS = bb.FS_KD_KELAS
      INNER JOIN TA_BED cc ON bb.FS_KD_KAMAR = cc.FS_KD_KAMAR
      WHERE aa.FS_KD_KELAS_dk <> '8'
      ORDER BY FS_NM_KELAS
    `;
    
    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => ({
        FS_NM_KELAS: row.FS_NM_KELAS,
        FS_KELAS_BPJS_BRIDGING: row.FS_KELAS_BPJS_BRIDGING
      }));
      callback(null, results);

      conn.close();
    });
  });
};


const kelasCek = (ruang, callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    
    let queryTambahan = '';
    if (ruang === '1' || ruang === undefined) {
      queryTambahan = '';
    } else {
      queryTambahan = `AND FS_KELAS_BPJS_BRIDGING = '${ruang}'`;
    }
    
    console.log(queryTambahan);
    const query = `
      SELECT
        dd.fs_kelas_bpjs_bridging AS kelas,
        namaruang = cc.fs_nm_bangsal + ' - ' + dd.fs_nm_kelas,
        count(aa.fs_kd_bed) AS kapasitas_bed,
        count(aa.fs_kd_bed) - count(ee.fs_kd_bed) AS sedia_bed
      FROM
        ta_bed aa
        INNER JOIN ta_kamar bb ON aa.fs_kd_kamar = bb.fs_kd_kamar
        INNER JOIN ta_bangsal cc ON bb.fs_kd_bangsal = cc.fs_kd_bangsal
        INNER JOIN ta_kelas dd ON bb.fs_kd_kelas = dd.fs_kd_kelas
        LEFT JOIN (
          SELECT
            aa.fs_kd_bed
          FROM
            ta_bed aa
            INNER JOIN ta_kamar bb ON aa.fs_kd_kamar = bb.fs_kd_kamar
            INNER JOIN ta_bangsal cc ON bb.fs_kd_bangsal = cc.fs_kd_bangsal
          WHERE
            cc.fs_kd_layanan IN (
              SELECT fs_kd_layanan
              FROM TA_LAYANAN aa
              INNER JOIN TA_INSTALASI bb ON aa.fs_kD_instalasi = bb.FS_KD_INSTALASI
              WHERE bb.FS_KD_INSTALASI_DK = '3'
            )
            AND fn_status = 1
            AND aa.fs_kd_reg <> ''
        ) ee ON aa.fs_kd_bed = ee.fs_kd_bed
      WHERE
        cc.fs_kd_layanan IN (
          SELECT fs_kd_layanan
          FROM TA_LAYANAN aa
          INNER JOIN TA_INSTALASI bb ON aa.fs_kD_instalasi = bb.FS_KD_INSTALASI
          WHERE bb.FS_KD_INSTALASI_DK = '3'
        )
        AND aa.fb_idle_publik = 0
        AND aa.fb_idle = 0
        AND bb.fb_kelas_gabung = 0
        AND LEFT(bb.fs_nm_kamar, 2) <> 'XX'
        AND LEFT(aa.fs_nm_bed, 2) <> 'XX'
        AND LEFT(cc.fs_nm_bangsal, 2) <> 'XX'
        ${queryTambahan}
      GROUP BY
        dd.fs_kelas_bpjs_bridging,
        cc.fs_nm_bangsal,
        bb.fs_kd_kelas,
        dd.fs_nm_kelas,
        dd.fs_kelas_inisial,
        cc.fs_kd_layanan,
        bb.fs_kd_bangsal_sub
      ORDER BY
        kelas
    `;    


    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      const results = rows.map(row => ({
        namaruang: row.namaruang,
        kapasitas_bed: row.kapasitas_bed,
        sedia_bed: row.sedia_bed
      }));

      callback(null, results);
      conn.close();
    });
  });
};

const kuotaDokter = (data,callback) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }

    const tanggalParts = data.tglbooking.split('/');
    const tanggalObj = new Date(`${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}`);
    const hari = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'][tanggalObj.getDay()];

    const query0 = `
      SELECT FS_NM_PEG, aa.FS_KD_LAYANAN, FS_KD_DOKTER, aa.FS_PRAKTEK, FS_MULAI, FS_AKHIR
      FROM TA_JADWAL_DOKTER_PRAKTEK aa
      INNER JOIN TA_LAYANAN bb ON aa.FS_KD_LAYANAN = bb.FS_KD_LAYANAN
      INNER JOIN td_peg cc ON aa.FS_KD_DOKTER = cc.fs_kd_peg
      WHERE bb.FS_NM_LAYANAN = '${data.Idpoli}'
      AND FS_NM_PEG = '${data.dokter}'
      AND (FN_TAHUN = ${tanggalParts[2]} OR fn_tahun = 0)
      AND (fn_bulan = ${tanggalParts[1]} OR fn_bulan = 0)
      AND FS_HARI = '${hari}'
      GROUP BY cc.fs_nm_peg, aa.FS_PRAKTEK, aa.FS_MULAI, aa.FS_AKHIR, aa.FS_KD_LAYANAN, aa.FS_KD_DOKTER 
      ORDER BY cc.fs_nm_peg
    `;

    conn.query(query0, (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      let poli = result[0].FS_KD_LAYANAN;
      let dokter = result[0].FS_KD_DOKTER;
      let tanggalBok = tanggalParts[2]+'-'+tanggalParts[1]+'-'+tanggalParts[0];

    const query = `
        select isnull(sum(fn_max),0) fn_max_booking
        from   TA_TRS_BOOKING_KUOTA
        where  FS_KD_LAYANAN = '${poli}'
        and          FS_KD_MEDIS= '${dokter}'
        and          FS_HARI = '${hari}'
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }
      

      let maxbok = rows[0].fn_max_booking;

        const query1 = `
            select  count(fs_pasien) fn_booking
            from   (
            select  1 aa , fs_kd_reg fs_pasien
            from   TA_REGISTRASI 
            where  fd_tgl_void = '3000-01-01'
            and          fd_tgl_masuk = '${tanggalBok}'
            and          FS_KD_LAYANAN = '${poli}'
            and          FS_KD_MEDIS= '${dokter}'
            union 
            select 2 aa , fs_kd_trs fs_pasien
            from   TA_TRS_BOOK_REG
            where  fd_tgl_void = '3000-01-01'
            and          fd_tgl_datang = '${tanggalBok}'
            and          FS_KD_LAYANAN = '${poli}'
            and          FS_KD_peg= '${dokter}'
            ) xx
          `;

          conn.query(query1, (err, rows1) => {
            if (err) {
              console.log(err);
              callback(err, null);
              return;
            }
            
        let minbok = rows1[0].fn_booking;
          let kuota = 2;
            if(maxbok == 0){
              kuota == 1;
            }else if(maxbok >= 1 && maxbok == minbok){
              kuota = 0;
            }else{
              kuota = 1;
            }

            console.log('ini kuota config '+kuota);
            const results = kuota;
            callback(null, results);

      conn.close();
        });
      });
    });
  });
};

module.exports = {
  sendQueryResult,
  sendAnotherFunction,
  khususPoli,
  khususDokterPoli,
  InsertTAantrian,
  InsertTA_TRS_BOOK_REG,
  statusMr,
  kelasRs,
  kelasCek,
  kuotaDokter
};

//select aa.fs_kd_layanan, aa.fs_kd_dokter, fs_nm_layanan, fs_nm_peg, 
//          aa.fs_praktek, fs_mulai +'-'+ fs_akhir fs_jam, 
//          fs_jam_in = isnull(( select min(fs_jam_in)  
//                               from   ta_jadwal_dokter_pre xx 
//                               Where  aa.fs_kd_layanan = xX.fs_kd_layanan 
//                               and    aa.fs_kd_dokter = xx.fs_kd_dokter 
//                               and    aa.fs_praktek = xx.fs_praktek 
//                               and    aa.fs_hari = xx.fs_hari 
//                               and    xx.fs_status = 'SDH DATANG' 
//                               and    xx.fd_tgl_in = '${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}'),'-') , 
//           isnull(dd.fs_status,'') fs_status , '' fs_telat 
//  from    ta_jadwal_dokter_praktek aa 
//  inner   join td_peg bb on aa.fs_kd_dokter = bb.fs_kd_peg 
//  inner   join ta_layanan cc on aa.fs_kd_layanan = cc.fs_kd_layanan 
//  left    join VIEW_JADWAL_DOKTER_PRE_NO dd on aa.fs_kd_layanan = dd.fs_kd_layanan  
//               and aa.fs_kd_dokter = dd.fs_kd_dokter 
//               and aa.fs_praktek = dd.fs_praktek 
//               and aa.fs_hari = dd.fs_hari 
//               and dd.fd_tgl_in = '${tanggalParts[2]}-${tanggalParts[1]}-${tanggalParts[0]}' 
//  Where   aa.fs_hari = 'SELASA' 
//  and     fn_tahun = ${tanggalParts[2]}
//  and     fn_bulan = ${tanggalParts[1]}
//  AND	 cc.FS_NM_LAYANAN = '${jenisPoli}' 
//  order   by fs_nm_layanan, fs_nm_peg

//  select	cc.FS_NM_PEG fs_dokter, aa.FS_PRAKTEK, aa.FS_MULAI,aa.FS_AKHIR 
// from	TA_JADWAL_DOKTER_PRAKTEK aa
// inner	join TA_LAYANAN bb on aa.FS_KD_LAYANAN = bb.FS_KD_LAYANAN
// inner	join td_peg cc on aa.FS_KD_DOKTER = cc.fs_kd_peg
// where	bb.FS_NM_LAYANAN = 'ANAK POLI'
// and		(FN_TAHUN = 2023 or fn_tahun = 0)
// and		(fn_bulan = 5 or fn_bulan = 0)
// and		FS_HARI = 'RABU'
// group	by cc.fs_nm_peg, aa.FS_PRAKTEK, aa.FS_MULAI,aa.FS_AKHIR 
// order	by cc.fs_nm_peg

// KELAS

// select    distinct FS_NM_KELAS, FS_KELAS_BPJS_BRIDGING

// from       TA_KELAS aa

// inner      join ta_kamar bb on aa.FS_KD_KELAS = bb.FS_KD_KELAS

// inner      join TA_BED cc on bb.FS_KD_KAMAR = cc.FS_KD_KAMAR

// where    aa.FS_KD_KELAS_dk <> '8'

// order     by FS_NM_KELAS


// Cek KELAS


// select  dd.fs_kelas_bpjs_bridging kelas,

//                                namaruang = cc.fs_nm_bangsal + ' - ' + dd.fs_nm_kelas,

//           count(aa.fs_kd_bed) kapasitas_bed,

//                                 count(aa.fs_kd_bed) - count(ee.fs_kd_bed) sedia_bed

//   from    ta_bed aa

//   inner   join ta_kamar bb on aa.fs_kd_kamar = bb.fs_kd_kamar

//   inner   join ta_bangsal cc on bb.fs_kd_bangsal = cc.fs_kd_bangsal

//   inner   join ta_kelas dd on bb.fs_kd_kelas = dd.fs_kd_kelas

//   left    join (

//           select  aa.fs_kd_bed

//            from    ta_bed aa

//            inner   join ta_kamar bb on aa.fs_kd_kamar = bb.fs_kd_kamar

//            inner   join ta_bangsal cc on bb.fs_kd_bangsal =
// cc.fs_kd_bangsal

//            where   cc.fs_kd_layanan in (


//                   select    fs_kd_layanan


//                   from       TA_LAYANAN aa


//                   inner join TA_INSTALASI bb on aa.fs_kD_instalasi = bb.FS_KD_INSTALASI


//                   where    bb.FS_KD_INSTALASI_DK = '3'

//                                                                )

//            and     fn_status = 1 and aa.fs_kd_reg <> ''

//            ) ee on aa.fs_kd_bed= ee.fs_kd_bed

//   where   cc.fs_kd_layanan in (select fs_kd_layanan from TA_LAYANAN aa
// inner join TA_INSTALASI bb on aa.fs_kD_instalasi = bb.FS_KD_INSTALASI
// where               bb.FS_KD_INSTALASI_DK = '3')

//   and     aa.fb_idle_publik = 0

//   and     aa.fb_idle = 0

//   and     bb.fb_kelas_gabung = 0

//   and     left(bb.fs_nm_kamar,2) <> 'XX'

//   and     left(aa.fs_nm_bed,2) <> 'XX'

//   and       left(cc.fs_nm_bangsal,2) <> 'XX'

//   and       FS_KELAS_BPJS_BRIDGING = 'KL3'

//   group   by dd.fs_kelas_bpjs_bridging,

//                                               cc.fs_nm_bangsal,

//                                               bb.fs_kd_kelas,

//                                               dd.fs_nm_kelas,

//                                               dd.fs_kelas_inisial,

//                                               cc.fs_kd_layanan,

//                                               bb.fs_kd_bangsal_sub

// order     by kelas
