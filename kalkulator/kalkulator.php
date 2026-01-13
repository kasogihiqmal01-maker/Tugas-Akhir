<?php
session_start();

/* ====== KONFIGURASI MEDIA TV ====== */
// bisa pakai gambar, video MP4, atau YouTube
$media_url = "https://upload.wikimedia.org/wikipedia/commons/1/1c/Joko_Widodo_2014_official_portrait.jpg";

/* ====== DETEKSI TIPE MEDIA ====== */
$is_video = preg_match('/\.(mp4|webm|ogg)(\?|$)/i', $media_url);
$is_youtube = preg_match('/(youtube\.com|youtu\.be)/i', $media_url);

/* ====== KONVERSI LINK YOUTUBE KE EMBED ====== */
if ($is_youtube) {
    if (preg_match('/v=([^&]+)/', $media_url, $matches)) {
        $youtube_id = $matches[1];
    } elseif (preg_match('/youtu\.be\/([^?]+)/', $media_url, $matches)) {
        $youtube_id = $matches[1];
    }
    $embed_url = "https://www.youtube.com/embed/" . $youtube_id . "?autoplay=1&mute=1&loop=1&playlist=" . $youtube_id . "&controls=0&showinfo=0&modestbranding=1";
}

/* ====== INISIALISASI ====== */
if (!isset($_SESSION['history'])) {
    $_SESSION['history'] = [];
}
$hasil = "";

/* ====== PROSES TOMBOL ====== */
if (isset($_POST['tampil'])) {
    $hasil = $_POST['tampil'];
}
if (isset($_POST['btn'])) {
    $tombol = $_POST['btn'];
    if ($tombol == "C") {
        $hasil = "";
    } elseif ($tombol == "DEL") {
        $hasil = substr($hasil, 0, -1);
    } elseif ($tombol == "=") {
        try {
            $evaluasi = eval("return ($hasil);");

            // 🔥 BAGIAN DIUBAH UNTUK RIWAYAT
            $riwayat_str = $hasil . " = " . $evaluasi;  // simpan ekspresi + hasil
            $hasil = $evaluasi;
            $_SESSION['history'][] = $riwayat_str;

        } catch (Throwable $e) {
            $hasil = "Error";
        }
    } else {
        $hasil .= $tombol;
    }
}

/* ====== HAPUS RIWAYAT ====== */
if (isset($_POST['hapus_history'])) {
    $index = $_POST['hapus_history'];
    if (isset($_SESSION['history'][$index])) {
        unset($_SESSION['history'][$index]);
        $_SESSION['history'] = array_values($_SESSION['history']);
    }
}
if (isset($_POST['hapus_semua'])) {
    $_SESSION['history'] = [];
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kalkulator PHP dengan TV Landscape</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(145deg, #111, #333);
        color: white;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 30px;
        padding: 40px;
        min-height: 100vh;
    }

    .container {
        display: flex;
        align-items: flex-start;
        gap: 25px;
    }

    /* ===== Kalkulator ===== */
    .kalkulator {
        background: rgba(34, 34, 34, 0.95);
        padding: 20px;
        border-radius: 25px;
        box-shadow: 0px 4px 15px rgba(0,0,0,0.4);
        width: 320px;
    }
    .layar {
        background: #333;
        height: 60px;
        border-radius: 10px;
        text-align: right;
        padding: 15px;
        font-size: 24px;
        overflow-x: auto;
        margin-bottom: 15px;
    }
    .tombol-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }
    button {
        background: #555;
        color: white;
        border: none;
        font-size: 18px;
        padding: 18px;
        border-radius: 12px;
        cursor: pointer;
        transition: 0.2s;
    }
    button:hover { background: #777; }
    .operator { background: #0a84ff; }
    .operator:hover { background: #006edc; }
    .clear { background: #ff3b30; }
    .clear:hover { background: #d63027; }
    .equal { background: #34c759; }
    .equal:hover { background: #28a745; }

    /* ===== TV Landscape di kiri ===== */
    .tv {
        background: #111;
        border: 10px solid #444;
        border-radius: 20px;
        width: 340px; /* sama tinggi kalkulator */
        height: 380px; /* kira-kira tinggi kalkulator */
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 0 10px #000, 0 0 20px #000;
    }
    .tv::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 80%);
        z-index: 2;
    }
    .tv iframe, .tv video, .tv img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: none;
    }

    /* ===== Riwayat ===== */
    .riwayat {
        background: rgba(255, 255, 255, 0.9);
        color: #000;
        padding: 15px;
        border-radius: 15px;
        width: 240px;
        max-height: 420px;
        overflow-y: auto;
        box-shadow: 0px 4px 15px rgba(0,0,0,0.2);
    }
    .riwayat h3 { margin-top: 0; text-align: center; }
    .item-history {
        background: #f4f4f4;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .hapus-item {
        background: #ff3b30;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 4px 6px;
        cursor: pointer;
        font-size: 12px;
    }
    .hapus-item:hover { background: #d63027; }
    .hapus-semua {
        width: 100%;
        background: #ff9500;
        color: white;
        padding: 8px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 5px;
    }
    .hapus-semua:hover { background: #d87b00; }
</style>
</head>
<body>

<div class="container">
    <!-- TV Landscape di sebelah kiri -->
    <div class="tv">
        <?php if ($is_youtube && isset($embed_url)): ?>
            <iframe src="<?= htmlspecialchars($embed_url) ?>" allow="autoplay; fullscreen"></iframe>
        <?php elseif ($is_video): ?>
            <video autoplay loop muted playsinline>
                <source src="<?= htmlspecialchars($media_url) ?>" type="video/mp4">
            </video>
        <?php else: ?>
            <img src="<?= htmlspecialchars($media_url) ?>" alt="Gambar TV">
        <?php endif; ?>
    </div>

    <!-- Kalkulator -->
    <div class="kalkulator">
        <h2 style="text-align:center;">🧮 Kalkulator PHP</h2>
        <form method="POST">
            <div class="layar"><?= htmlspecialchars($hasil) ?></div>
            <input type="hidden" name="tampil" value="<?= htmlspecialchars($hasil) ?>">
            <div class="tombol-container">
                <button name="btn" value="C" class="clear">C</button>
                <button name="btn" value="DEL" class="clear">DEL</button>
                <button name="btn" value="(">(</button>
                <button name="btn" value=")" class="operator">)</button>

                <button name="btn" value="7">7</button>
                <button name="btn" value="8">8</button>
                <button name="btn" value="9">9</button>
                <button name="btn" value="/" class="operator">÷</button>

                <button name="btn" value="4">4</button>
                <button name="btn" value="5">5</button>
                <button name="btn" value="6">6</button>
                <button name="btn" value="*" class="operator">×</button>

                <button name="btn" value="1">1</button>
                <button name="btn" value="2">2</button>
                <button name="btn" value="3">3</button>
                <button name="btn" value="-" class="operator">−</button>

                <button name="btn" value="0">0</button>
                <button name="btn" value=".">.</button>
                <button name="btn" value="=" class="equal">=</button>
                <button name="btn" value="+" class="operator">+</button>
            </div>
        </form>
    </div>

    <!-- Riwayat -->
    <div class="riwayat">
        <h3>📜 Riwayat</h3>
        <?php if (!empty($_SESSION['history'])): ?>
            <?php foreach ($_SESSION['history'] as $index => $teks): ?>
                <form method="POST" style="margin:0;">
                    <div class="item-history">
                        <span><?= htmlspecialchars($teks) ?></span>
                        <button class="hapus-item" name="hapus_history" value="<?= $index ?>">✖</button>
                    </div>
                </form>
            <?php endforeach; ?>
            <form method="POST">
                <button name="hapus_semua" value="1" class="hapus-semua">Hapus Semua</button>
            </form>
        <?php else: ?>
            <p style="text-align:center; color:gray;">Belum ada riwayat</p>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
