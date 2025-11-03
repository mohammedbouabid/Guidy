import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, X, MapPin, Clock, Users } from "lucide-react";
import { fetchGuidePacks } from "../../store/slices/packSlice";

// Obtenir le numéro de semaine
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const CalenderPacks = () => {
  const dispatch = useDispatch();
  const { items: packs, loading } = useSelector((state) => state.pack);
  
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [view, setView] = useState("month"); // day, week, month
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(currentDate));
  const [selectedPack, setSelectedPack] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fonction pour ouvrir le popup avec les détails du pack
  const handlePackClick = (pack) => {
    setSelectedPack(pack);
    setShowPopup(true);
  };

  // Fonction pour fermer le popup
  const closePopup = () => {
    setShowPopup(false);
    setTimeout(() => setSelectedPack(null), 300);
  };

  useEffect(() => {
    dispatch(fetchGuidePacks());
  }, [dispatch]);

  // Noms des mois
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Noms des jours
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Obtenir le premier jour du mois
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDay = firstDayOfMonth.getDay(); // 0 = dimanche
  const daysInMonth = lastDayOfMonth.getDate();

  // Jours du mois précédent à afficher
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = startDay;

  // Palette de couleurs pour les packs
  const packColors = [
    { bg: "#EDE9FE", border: "#8B5CF6", text: "#6D28D9" }, // Violet
    { bg: "#FCE7F3", border: "#EC4899", text: "#BE185D" }, // Rose
    { bg: "#FED7AA", border: "#F97316", text: "#C2410C" }, // Orange
    { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" }, // Bleu
    { bg: "#D1FAE5", border: "#10B981", text: "#065F46" }, // Vert
  ];

  // Convertir les packs en événements du calendrier
  const getPacksForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return (packs || []).filter(pack => {
      const startDate = new Date(pack.startDate);
      const endDate = new Date(pack.endDate);
      const checkDate = new Date(dateStr);
      
      return checkDate >= startDate && checkDate <= endDate;
    }).map(pack => {
      // Utiliser l'ID du pack pour déterminer sa couleur de manière cohérente
      const packIndex = (packs || []).findIndex(p => p._id === pack._id);
      return {
        ...pack,
        color: packColors[packIndex % packColors.length]
      };
    });
  };

  // Vérifier si un pack commence à cette date
  const isPackStart = (pack, year, month, day) => {
    const startDate = new Date(pack.startDate);
    return startDate.getFullYear() === year && 
           startDate.getMonth() === month && 
           startDate.getDate() === day;
  };

  // Calculer la durée d'un pack dans une semaine
  const getPackDuration = (pack, startDate, weekView = false) => {
    const packStart = new Date(pack.startDate);
    const packEnd = new Date(pack.endDate);
    const currentStart = new Date(startDate);
    
    // Si le pack commence avant la période visible
    const effectiveStart = packStart < currentStart ? currentStart : packStart;
    
    // Calculer le nombre de jours
    const diffTime = Math.abs(packEnd - effectiveStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return Math.min(diffDays, weekView ? 7 : 7); // Limiter à 7 jours max par ligne
  };

  // Organiser les packs en lignes pour éviter les chevauchements
  const organizePacksInRows = (year, month, day) => {
    const dayPacks = getPacksForDate(year, month, day);
    
    // Trier les packs par date de début puis par durée (les plus longs en premier)
    const sortedPacks = [...dayPacks].sort((a, b) => {
      const aStart = new Date(a.startDate);
      const bStart = new Date(b.startDate);
      
      if (aStart.getTime() !== bStart.getTime()) {
        return aStart.getTime() - bStart.getTime();
      }
      
      // Si même date de début, trier par durée (plus long en premier)
      const aDuration = new Date(a.endDate) - new Date(a.startDate);
      const bDuration = new Date(b.endDate) - new Date(b.startDate);
      return bDuration - aDuration;
    });
    
    return sortedPacks;
  };

  // Navigation
  const goToToday = () => {
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
    setCurrentWeek(getWeekNumber(currentDate));
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToPreviousWeek = () => {
    if (currentWeek === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentWeek(52);
    } else {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeek === 52) {
      setCurrentYear(currentYear + 1);
      setCurrentWeek(1);
    } else {
      setCurrentWeek(currentWeek + 1);
    }
  };

  // Générer les jours de la semaine
  const renderWeekDays = () => {
    const days = [];
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysOffset = (currentWeek - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    // Ajuster au dimanche de la semaine
    const dayOfWeek = firstDayOfWeek.getDay();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDayOfWeek);
      currentDay.setDate(currentDay.getDate() + i);
      
      const day = currentDay.getDate();
      const month = currentDay.getMonth();
      const year = currentDay.getFullYear();
      
      const isToday = 
        day === currentDate.getDate() && 
        month === currentDate.getMonth() && 
        year === currentDate.getFullYear();
      
      const dayPacks = organizePacksInRows(year, month, day);
      
      days.push(
        <div
          key={`week-${i}`}
          className={`min-h-[140px] bg-white p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
            isToday ? 'ring-2 ring-[#EB662B] ring-inset' : ''
          }`}
        >
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {day}
          </div>
          
          <div className="space-y-1 mt-1">
            {dayPacks.slice(0, 4).map((pack, index) => {
              const packStart = new Date(pack.startDate);
              const packEnd = new Date(pack.endDate);
              const currentDateObj = new Date(year, month, day);
              
              // Calculer si c'est le début, le milieu ou la fin du pack
              const isStart = packStart.toDateString() === currentDateObj.toDateString();
              const isEnd = packEnd.toDateString() === currentDateObj.toDateString();
              const isContinuing = !isStart && !isEnd;
              
              const packDuration = Math.ceil((packEnd - packStart) / (1000 * 60 * 60 * 24)) + 1;
              
              return (
                <div
                  key={pack._id}
                  className="text-sm px-3 py-3 cursor-pointer font-semibold hover:opacity-90 transition-opacity"
                  onClick={() => handlePackClick(pack)}
                  style={{
                    background: `linear-gradient(to bottom, ${pack.color.bg}e5 0%, ${pack.color.bg}f8 100%)`,
                    borderLeft: isStart ? `4px solid ${pack.color.border}` : 'none',
                    color: pack.color.text,
                    borderRadius: isStart && isEnd ? '6px' : isStart ? '6px 0 0 6px' : isEnd ? '0 6px 6px 0' : '0',
                    marginLeft: isContinuing ? '-0.5rem' : '0',
                    marginRight: isContinuing ? '-0.5rem' : '0',
                    paddingLeft: isStart ? '0.75rem' : isContinuing ? '0.75rem' : '0.5rem',
                    paddingRight: isContinuing ? '0.75rem' : '0.5rem'
                  }}
                  title={pack.title}
                >
                  {isStart && (
                    <span className="truncate block">
                      {pack.title} <span className="text-xs opacity-75">({packDuration} {packDuration > 1 ? 'jours' : 'jour'})</span>
                    </span>
                  )}
                  {isContinuing && <span className="truncate block opacity-0">-</span>}
                  {isEnd && !isStart && <span className="truncate block opacity-0">-</span>}
                </div>
              );
            })}
            {dayPacks.length > 4 && (
              <div className="text-xs text-gray-500 px-1 mt-1">
                +{dayPacks.length - 4} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Générer les jours du calendrier
  const renderCalendarDays = () => {
    const days = [];
    
    // Jours du mois précédent
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="min-h-[140px] bg-gray-50/50 p-3 border border-gray-100"
          style={{
            background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)'
          }}
        >
          <div className="text-sm text-gray-400 font-medium">{day}</div>
        </div>
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === currentDate.getDate() && 
        currentMonth === currentDate.getMonth() && 
        currentYear === currentDate.getFullYear();
      
      const dayPacks = organizePacksInRows(currentYear, currentMonth, day);

      days.push(
        <div
          key={`current-${day}`}
          className={`min-h-[140px] bg-white p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
            isToday ? 'ring-2 ring-[#EB662B] ring-inset' : ''
          }`}
        >
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {day}
          </div>
          
          <div className="space-y-1 mt-1">
            {dayPacks.slice(0, 4).map((pack, index) => {
              const packStart = new Date(pack.startDate);
              const packEnd = new Date(pack.endDate);
              const currentDateObj = new Date(currentYear, currentMonth, day);
              
              // Calculer si c'est le début, le milieu ou la fin du pack
              const isStart = packStart.toDateString() === currentDateObj.toDateString();
              const isEnd = packEnd.toDateString() === currentDateObj.toDateString();
              const isContinuing = !isStart && !isEnd;
              
              const packDuration = Math.ceil((packEnd - packStart) / (1000 * 60 * 60 * 24)) + 1;
              
              return (
                <div
                  key={pack._id}
                  className="text-sm px-3 py-4 cursor-pointer font-semibold hover:opacity-90 transition-opacity"
                  onClick={() => handlePackClick(pack)}
                  style={{
                    background: `linear-gradient(to bottom, ${pack.color.bg}e5 0%, ${pack.color.bg}f8 100%)`,
                    borderLeft: isStart ? `4px solid ${pack.color.border}` : 'none',
                    color: pack.color.text,
                    borderRadius: isStart && isEnd ? '6px' : isStart ? '2px 0 0 2px' : isEnd ? '0 6px 6px 0' : '0',
                    marginLeft: isContinuing ? '-0.5rem' : '0',
                    marginRight: isContinuing ? '-0.5rem' : '0',
                    paddingLeft: isStart ? '0.75rem' : isContinuing ? '0.75rem' : '0.5rem',
                    paddingRight: isContinuing ? '0.75rem' : '0.5rem'
                  }}
                  title={pack.title}
                >
                  {isStart && (
                    <span className="truncate block">
                      {pack.title} <span className="text-xs opacity-75">({packDuration} {packDuration > 1 ? 'jours' : 'jour'})</span>
                    </span>
                  )}
                  {isContinuing && <span className="truncate block opacity-0">-</span>}
                  {isEnd && !isStart && <span className="truncate block opacity-0">-</span>}
                </div>
              );
            })}
            {dayPacks.length > 4 && (
              <div className="text-xs text-gray-500 px-1 mt-1">
                +{dayPacks.length - 4} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="min-h-[140px] bg-gray-50/50 p-3 border border-gray-100"
          style={{
            background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)'
          }}
        >
          <div className="text-sm text-gray-400 font-medium">{day}</div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          {/* Left: Today button */}
 <button
  onClick={goToToday}
  className="px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer text-white"
  style={{ backgroundColor: "#EB662B" }}
>
  Today
</button>


          {/* Center: Month navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={view === 'week' ? goToPreviousWeek : goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 min-w-[200px] text-center">
              {view === 'week' ? `Week ${currentWeek} - ${currentYear}` : `${monthNames[currentMonth]} ${currentYear}`}
            </h2>
            
            <button
              onClick={view === 'week' ? goToNextWeek : goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Right: View buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                view === "week"
                  ? "bg-[#EB662B] text-white"
                  : "text-gray-700 bgwhite border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                view === "month"
                  ? "bg-[#EB662B] text-white"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day names */}
          <div className="grid grid-cols-7 rounded-2xl">
            {view === 'week' ? (
              // Affichage des dates pour la vue semaine
              (() => {
                const firstDayOfYear = new Date(currentYear, 0, 1);
                const daysOffset = (currentWeek - 1) * 7;
                const firstDayOfWeek = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
                const dayOfWeek = firstDayOfWeek.getDay();
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek);
                
                return Array.from({ length: 7 }, (_, i) => {
                  const currentDay = new Date(firstDayOfWeek);
                  currentDay.setDate(currentDay.getDate() + i);
                  const monthName = monthNames[currentDay.getMonth()].substring(0, 3);
                  
                  return (
                    <div
                      key={i}
                      className="text-center py-3 bg-gray-100 border-b border-gray-200"
                    >
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">{dayNames[i]}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {monthName} {currentDay.getDate()}
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              // Affichage normal pour la vue mois
              dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide py-3 bg-gray-100 border-b border-gray-200"
                >
                  {day}
                </div>
              ))
            )}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0 border-l border-t border-gray-200">
            {view === 'week' ? renderWeekDays() : renderCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Packs: <span className="font-semibold text-gray-900">{packs?.length || 0}</span>
            </div>
            <div className="flex gap-4">
              {packColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color.border }}
                  ></div>
                  <span className="text-xs text-gray-600">Pack Type {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && selectedPack && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image de couverture */}
            <div 
              className="h-48 bg-gradient-to-br from-orange-200 via-amber-100 to-orange-200 relative"
              style={{
                background: `linear-gradient(135deg, ${selectedPack.color.bg} 0%, ${selectedPack.color.bg}dd 100%)`
              }}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold" style={{ color: selectedPack.color.border }}>
                      {selectedPack.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu du popup */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedPack.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedPack.description || "Aucune description disponible"}</p>

              {/* Informations */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPack.startDate).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                      {selectedPack.endDate && selectedPack.startDate !== selectedPack.endDate && (
                        <> - {new Date(selectedPack.endDate).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}</>
                      )}
                    </p>
                  </div>
                </div>

                {selectedPack.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Lieu</p>
                      <p className="text-sm text-gray-600">{selectedPack.location}</p>
                    </div>
                  </div>
                )}

                {selectedPack.participants && selectedPack.participants.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Participants</p>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedPack.participants.slice(0, 3).map((participant, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-semibold"
                          >
                            {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        ))}
                        {selectedPack.participants.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                            +{selectedPack.participants.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton d'action */}
              <button
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ 
                  backgroundColor: selectedPack.color.border,
                }}
                onClick={closePopup}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalenderPacks;
