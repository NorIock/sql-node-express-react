export default function ConvertTimestampToDate(timeStamp){

    let afficherDate = new Date(timeStamp*1);

    return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: 'numeric',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(afficherDate);
}