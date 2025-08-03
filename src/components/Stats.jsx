// src/components/Stats.jsx
import CountUp from 'react-countup';

const Stats = () => (
  <section className="bg-white py-16">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {[
        { label: 'Students Trained', value: 1500 },
        { label: 'Visa Success Rate', value: 98 },
        { label: 'Years of Experience', value: 10 }
      ].map((stat, i) => (
        <div key={i}>
          <h2 className="text-4xl font-bold text-purple-700">
            <CountUp end={stat.value} duration={2} suffix={stat.label.includes('%') ? '%' : ''} />
          </h2>
          <p className="mt-2 text-gray-600 text-lg">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);
export default Stats;
