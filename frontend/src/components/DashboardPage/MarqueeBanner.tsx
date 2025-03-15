import React from 'react';

const MarqueeBanner: React.FC = () => {
  return (
    <>
      <div className="text-5xl mt-12 pb-8 text-center font-bold">TODAY'S MARKET</div>
      <div className="overflow-hidden w-full flex justify-evenly py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-6">
          {cards.map(card => (
            <div
            key={card.id}
            className="border border-gray-200 bg-white text-black px-6 py-4 rounded-lg shadow-sm min-w-[200px] text-center"
            >
              <h2 className='text-3xl font-semibold'>{card.title}</h2>
              <p className='text-xl font-bold mt-4 text-green-400'>{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const cards = [
  { id: 1, title: 'Nifty 50', value: '17%' },
  { id: 2, title: 'Nifty Bank', value: '7%' },
  { id: 3, title: 'Sensex', value: '10%' },
];

export default MarqueeBanner;