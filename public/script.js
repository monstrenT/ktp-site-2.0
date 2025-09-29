function addRow(record = {}) {
  if (!currentMonth || !currentKtp) return alert('Выберите месяц и КТП!');
  const tbody = document.querySelector('#dataTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input value="${record.account||''}"></td>
    <td><input value="${record.address||''}"></td>
    <td><input type="number" value="${record.start||0}"></td>
    <td><input type="number" value="${record.end||0}"></td>
    <td class="diff">${(record.end||0)-(record.start||0)}</td>
    <td>
      <select>
        <option value="">-- выбрать --</option>
        <option value="Нужна проверка">Нужна проверка</option>
        <option value="Нет пломбы">Нет пломбы</option>
        <option value="Не работает ПУ">Не работает ПУ</option>
      </select>
    </td>
    <td><input type="file" accept="image/*"></td>
  `;
  if (record.note) tr.children[5].firstElementChild.value = record.note;
  
  tr.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('input', () => {
      const start = Number(tr.children[2].firstElementChild.value);
      const end = Number(tr.children[3].firstElementChild.value);
      tr.children[4].innerText = end - start;
      updateLossRow();
    });
  });

  tbody.appendChild(tr);
  updateLossRow();
}

function exportToExcel() {
  saveCurrent(); // сохраняем перед экспортом
  if (!currentMonth || !currentKtp) return alert('Выберите месяц и КТП!');
  const data = dataStore[currentMonth][currentKtp].records;
  if (!data || data.length === 0) return alert('Нет данных для экспорта!');

  const ws_data = [];
  ws_data.push(["Лицевой счёт","Адрес","Начальные","Конечные","Разница","Примечание","Фото"]);

  data.forEach(rec => {
    ws_data.push([
      rec.account,
      rec.address,
      rec.start,
      rec.end,
      rec.end - rec.start,
      rec.note,
      rec.photo ? rec.photo.name : ""
    ]);
  });

  const ktpUseful = dataStore[currentMonth][currentKtp].ktpUseful || 0;
  let totalDiff = data.reduce((sum,r)=>sum+(r.end-r.start),0);
  ws_data.push(["Потери КТП","", "", "", "", "", ktpUseful - totalDiff]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, `${currentKtp}-${currentMonth}`);
  XLSX.writeFile(wb, `${currentKtp}-${currentMonth}.xlsx`);
}
