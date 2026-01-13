<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['tema'])) $_SESSION['tema'] = $_POST['tema'];
    if (isset($_POST['ukuran'])) $_SESSION['ukuran_tombol'] = $_POST['ukuran'];
    if (isset($_POST['media'])) $_SESSION['media_url'] = $_POST['media'];

    header("Location: kalkulator.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Pengaturan Kalkulator</title>
<style>
body {
    background: #111;
    color: white;
    font-family: Arial;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
}
form {
    background: #222;
    padding: 20px;
    border-radius: 15px;
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
input, select {
    padding: 8px;
    border-radius: 8px;
    border: none;
}
button {
    background: #0a84ff;
    border: none;
    color: white;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
}
a {
    color: #0a84ff;
    text-decoration: none;
    margin-top: 20px;
}
</style>
</head>
<body>
<h2>⚙️ Pengaturan Tampilan</h2>
<form method="POST">
    <label>🌈 Pilih Tema:</label>
    <select name="tema">
        <option value="gelap">Gelap</option>
        <option value="terang">Terang</option>
        <option value="biru">Biru</option>
    </select>

    <label>🔲 Ukuran Tombol:</label>
    <input type="range" name="ukuran" min="14" max="28" value="18">

    <label>🖼️ Ganti Gambar / Video / YouTube:</label>
    <input type="text" name="media" placeholder="Masukkan URL media">

    <button type="submit">💾 Simpan & Kembali</button>
</form>

<a href="kalkulator.php">⬅️ Kembali ke Kalkulator</a>
</body>
</html>
