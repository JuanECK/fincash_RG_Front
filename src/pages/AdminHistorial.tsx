import React from 'react';

const mockHistorialGeneral = [
  { operacion: '458965', tipo: 'Compra', monto: '-$40,000.00', fecha: '25/12/2026', comercio: 'Tiendita', concepto: 'Comida', esAbono: false },
  { operacion: '587459', tipo: 'Compra', monto: '-$89,586.00', fecha: '25/12/2026', comercio: 'Gasolinera', concepto: 'Gasolina', esAbono: false },
  { operacion: '852146', tipo: 'Abono', monto: '+$31,321.00', fecha: '24/12/2026', comercio: 'NA', concepto: 'NA', esAbono: true },
];

export const AdminHistorial: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <section className="stats-card-header">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Historial de operaciones Xolos</h1>
          <p className="text-slate-400 font-semibold text-xs mt-1">Registros de auditoría general</p>
        </div>
      </section>

      <section className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Operación</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Comercio</th>
              <th>Concepto</th>
            </tr>
          </thead>
          <tbody>
            {mockHistorialGeneral.map((mov, idx) => (
              <tr key={idx}>
                <td className="font-mono text-[#00E5FF] font-bold">{mov.operacion}</td>
                <td className="text-slate-300 font-semibold">{mov.tipo}</td>
                <td className={`font-mono font-bold ${mov.esAbono ? 'text-emerald-400' : 'text-white'}`}>{mov.monto}</td>
                <td className="text-slate-400">{mov.fecha}</td>
                <td className="font-bold text-slate-200">{mov.comercio}</td>
                <td className="text-slate-300">{mov.concepto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
