function sendmail() {
    var address, subject, body;
    address = 'c' + 'o' + 'n' + 't' + 'a' + 'c' + 't' + '@' + 'u' + 'd' + 'o' + 'n' + 'k' + 'o' + '.' + 'n' + 'e' + 't';
    subject = 'UDONKONETウェブサイトからのお問い合わせ';
    body = '';
    location.href = 'mailto:' + address + '?subject=' + subject + '&body=' + body;
}