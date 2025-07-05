import { MapPin, CreditCard } from "lucide-react";

const bankAgents = [
  {
    name: "Agente BCP",
    address: "Av. Lima 123, Pando",
    type: "BCP",
    icon: <CreditCard className="w-6 h-6 text-blue-700" />,
    map: "https://maps.google.com/?q=Agente+BCP+Av+Lima+123+Pando",
  },
  {
    name: "Agente Interbank",
    address: "Jr. Comercio 456, Pando",
    type: "Interbank",
    icon: <CreditCard className="w-6 h-6 text-green-700" />,
    map: "https://maps.google.com/?q=Agente+Interbank+Jr+Comercio+456+Pando",
  },
  {
    name: "Agente BBVA",
    address: "Calle Central 789, Pando",
    type: "BBVA",
    icon: <CreditCard className="w-6 h-6 text-blue-500" />,
    map: "https://maps.google.com/?q=Agente+BBVA+Calle+Central+789+Pando",
  },
  // Agrega más agentes según disponibilidad
];

export default function BankAgentsSection() {
  return (
    <section id="agentes-bancarios" className="w-full py-10 bg-gradient-to-br from-orange-50 to-yellow-50 border-t border-orange-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <MapPin className="w-7 h-7 text-orange-500" />
            Agentes Bancarios Cercanos
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Encuentra los principales agentes bancarios de la zona para tus operaciones y pagos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bankAgents.map((agent, idx) => (
            <a
              key={idx}
              href={agent.map}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-orange-100 hover:border-orange-300 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-2">
                {agent.icon}
                <span className="font-bold text-lg text-gray-800 group-hover:text-orange-500 transition-colors">
                  {agent.name}
                </span>
              </div>
              <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                {agent.address}
              </div>
              <div className="text-xs text-gray-400">Haz clic para ver en el mapa</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
