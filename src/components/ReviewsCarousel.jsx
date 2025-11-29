export default function ReviewsCarousel(){
  const reviews = [
    {name:'Nandani⚰️',text:'Loved the journey—beautiful views and a relaxing ride!',img:'/g1.jpg'},
  
    {name:'Anand💐',text:' “A smooth, safe, and unforgettable travel experience with ⚰️!”',img:'/g2.jpg'},
    {name:'Anshu🤑',text:'Perfect arrangements',img:'/g3.jpg'},
    {name:'Shubham',text:'The itinerary was perfectly planned, and the guide was increible knowledgeable',img:'/g4.jpg'},
    {name:'Smita🦓',text:'“A wonderful travel experience from beginning to end!',img:'/g2.jpg'},
    {name:'Vishakha🧸',text:'“Perfect journey—comfortable, timely, and well-organized!”',img:'/g3.jpg'},
    {name:'Suhani',text:'The itinerary was perfectly planned, and the guide was increible knowledgeable',img:'/g4.jpg'}
  ];
  return (
    <div className="overflow-x-auto py-6">
      <div className="flex gap-4 px-6">
        {reviews.map((r,i)=>(
          <div key={i} className="min-w-[260px] bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <img src={r.img} className="w-12 h-12 rounded-full object-cover" />
              <div><div className="font-semibold">{r.name}</div><div className="text-sm text-gray-500">Verified</div></div>
            </div>
            <p className="mt-3 text-gray-600">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
