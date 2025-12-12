export default function FAQ(){
  const items=[{q:'Cancellation?',a:'Full refund up to 7 days'}, {q:'Meals?', a:'Breakfast included'}, {q:'Pickup?', a:'Airport or hotel pickup available'}];
  return (
    <div className="grid gap-4">
      {items.map((it,i)=>(
        <details key={i} className="bg-white p-4 rounded-lg shadow">
          <summary className="font-semibold cursor-pointer">{it.q}</summary>
          <p className="mt-2 text-gray-600">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
