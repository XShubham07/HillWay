export default function Blog(){
  const posts = Array.from({length:6}).map((_,i)=>({title:'Guide '+(i+1),img:'/g1.jpg',excerpt:'Short excerpt...'}));
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">Travel Guides</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((p,i)=>(
          <article key={i} className="bg-white rounded-xl shadow p-4">
            <img src={p.img} className="w-full h-44 object-cover rounded" />
            <h3 className="mt-3 font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
