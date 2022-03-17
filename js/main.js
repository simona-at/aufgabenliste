"use strict";

$(document).ready(function (){

    addEntry();
    deletAll();
    deleteRow();
    filterDate();
    filterPriority();
    filterKategory();
    deleteFilters();

});


//Neue Aufgabe anlegen:
function addEntry() {
    $("#add").click(function (e) {
        e.preventDefault();

        let titel = $("#titelInput").val();
        let bezeichnung = $("#bezeichnungInput").val();
        let datum = $("#faelligkeitInput").val();
        let kategorie = $("#kategorieInput").val();
        let priority = $('input[name="prioritaet"]:checked').val();

        //heutiges Datum erzeugen:
        let heute = todaysDate();

        if (titel != "" && bezeichnung != "" && datum >= heute && priority != undefined) {

            //Alles wurde (korrekt) eingegeben:
            let htmlTag =
                `<tr class=${priority}>
                    <td>${datum}</td>
                    <td>${titel}</td>
                    <td>${bezeichnung}</td>
                    <td>${kategorie}</td>
                    <td>${priority}</td>
                    <td><a href='#' class='delete'>Löschen</a></td>
                 </tr>`;

            $("table tbody").append(htmlTag);
        }
        else {
            alert("Bitte gib einen Titel, eine Bezeichnung, ein gültiges Fälligkeitsdatum in der Zukunft " +
                "und die Priorität der Aufgabe an!");
        }

        //Klick auf "Löschen" in der Tabelle:
        deleteRow();
    });
}


//heutiges Datum erzeugen:
function todaysDate() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let heute = today.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day;
    return heute;
}


//Klick auf "Löschen" in der Tabelle:
function deleteRow() {
    let deleteBtn = $("a.delete");
    for (let i of deleteBtn) {
        i.onclick = function () {
            let rowTitel = $(i).parent().parent().children().eq(1).html();
            let rowPriority = $(i).parent().parent().children().eq(4).html();
            if (confirm("Möchten Sie wirklich \"" + rowTitel + "\" mit Priorität \"" + rowPriority +
                "\" löschen?")) {
                $(i).parent().parent().remove();
            }
        }
    }

    //Amkerung:
    //Ich hatte zuerst folgende Funktion zum Löschen einzelner Tabellen-Zeilen, jedoch selektiert $("a.delete")
    //alle Löschen-Buttons in der Tabelle und somit wurde das confirm-Fenster x-Mal (wie viele Einträge in der
    //auch in der Tabelle waren) ausgeführt. Gelöscht wurde dann eh nur die Zeile des tatsächlich angeklickten
    //Löschen-Buttons, aber ich hab leider einfach keine Lösung gefunden, wie ich das sonst mit jQuery hätte
    //lösen können – deshalb hab ich es dann mit einer "normalen" for-Schleife und einer onclick-function gelöst.
    //Die ursprüngliche Lösung war diese:
            /*
            $("a.delete").click(function (e){
                e.preventDefault();
                if(e.currentTarget) {
                    let rowTitel = $(e.currentTarget).parent().parent().children().eq(1).html();
                    let rowPriority = $(e.currentTarget).parent().parent().children().eq(4).html();
                    if(confirm("Möchten Sie wirklich \""+ rowTitel + "\" mit Priorität \"" + rowPriority +
                       "\" löschen?")){
                        $(e.currentTarget).parent().parent().remove();
                    }
                }
            });
            */
}


//Alle Einträge löschen
function deletAll() {
    $("#delete").click(function (e) {
        e.preventDefault();
        $("table tbody").empty();
    });
}


//Nach Datum filtern
function filterDate() {
    $("#filterDate").click(function (e) {
        e.preventDefault();

        let aktuelleValue = $(e.currentTarget).val();
        let von = $("#datumVon input").val();
        let bis = $("#datumBis input").val();

        if (von != "" && bis != "" && von <= bis) {
            let datum = $("tbody tr td:nth-child(1)");
            if (aktuelleValue === "Filter") {
                for (let i of datum) {
                    let entry = i.innerText;
                    if (von >= entry || entry >= bis) {
                        $(i).parent().hide(0);
                    }
                }
                $("#datumVon input").prop('disabled', true);
                $("#datumBis input").prop('disabled', true);
                $(e.currentTarget).val("aufheben");
            }
            else {
                for (let i of datum) {
                    let entry = i.innerText;
                    if (von >= entry || entry >= bis) {
                        $(i).parent().show(0);
                    }
                }
                $("#datumVon input").prop('disabled', false);
                $("#datumBis input").prop('disabled', false);
                $(e.currentTarget).val("Filter");
            }

        }
        else {
            alert("Bitte geben Sie zwei gültige Daten ein. \n (\"Von\" muss vor \"Bis\" liegen oder " +
                "der selbe Tag sein)")
        }
    });
}


//Nach Priorität filtern
function filterPriority() {
    $("#filterPrioritaet").click(function (e) {
        e.preventDefault();

        let aktuelleValue = $(e.currentTarget).val();
        let priorityFilter = $('input[name="prioritaetF"]:checked').val();

        if (priorityFilter != undefined) {
            let priorityEintrag = $("tbody tr td:nth-child(5)");
            if (aktuelleValue === "Filter") {
                for (let i of priorityEintrag) {
                    let entry = i.innerText;
                    if (priorityFilter != entry) {
                        $(i).parent().hide(0);
                    }
                }
                $("input[name='prioritaetF']").prop('disabled', true);
                $(e.currentTarget).val("aufheben");
            }
            else {
                for (let i of priorityEintrag) {
                    let entry = i.innerText;
                    if (priorityFilter != entry) {
                        $(i).parent().show(0);
                    }
                }
                $("input[name='prioritaetF']").prop('disabled', false);
                $(e.currentTarget).val("Filter");
            }
        }
        else {
            alert("Bitte wählen Sie die Priorität, nach der die Einträge gefiltert werden sollen.")
        }

    });
}


//Klick auf Kategoriefilter:
function filterKategory() {
    $("#filterKategorie").click(function (e) {
        e.preventDefault();

        let aktuelleValue = $(e.currentTarget).val();
        let kategorieFilter = $("#kategorieF").val();
        let kategorieEintrag = $("tbody tr td:nth-child(4)");

        if (aktuelleValue === "Filter") {
            for (let i of kategorieEintrag) {
                let entry = i.innerText;
                if (kategorieFilter != entry) {
                    $(i).parent().hide(0);
                }
            }
            $("#kategorieF").prop('disabled', true);
            $(e.currentTarget).val("aufheben");
        }
        else {
            for (let i of kategorieEintrag) {
                let entry = i.innerText;
                if (kategorieFilter != entry) {
                    $(i).parent().show(0);
                }
            }
            $("#kategorieF").prop('disabled', false);
            $(e.currentTarget).val("Filter");
        }
    });
}


//Klick auf Filter aufheben:
function deleteFilters() {
    $("#deleteFilter").click(function (e) {
        e.preventDefault();
        $("tbody tr").show(0);

        //Wörter in den einzelnen Filter-Buttons wieder umkehren und input-Felder wieder aktivieren:
        $("#filterDate").val("Filter");
        $("#datumVon input").prop('disabled', false);
        $("#datumBis input").prop('disabled', false);
        $("#filterPrioritaet").val("Filter");
        $("input[name='prioritaetF']").prop('disabled', false);
        $("#filterKategorie").val("Filter");
        $("#kategorieF").prop('disabled', false);

    });
}