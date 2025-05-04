import { GiftIcon, TruckIcon, TagIcon } from "@heroicons/react/24/solid";

export default function PromoTicker() {
  return (
    <div className="overflow-hidden bg-amber-50 dark:bg-gray-800 py-3">
      <div className="animate-marquee whitespace-nowrap flex gap-12 text-indigo-900 dark:text-white font-medium text-sm">
        <PromoItem icon={<TruckIcon className="w-5 h-5 text-pink-600" />} text="Miễn phí giao hàng từ 200.000đ" />
        <PromoItem icon={<GiftIcon className="w-5 h-5 text-yellow-500" />} text="Quà tặng bất ngờ trong mỗi hộp snack" />
        <PromoItem icon={<TagIcon className="w-5 h-5 text-purple-600" />} text="Nhập mã SUMMER20 giảm 20% với các hóa đơn trên 200.000đ" />
        <PromoItem icon={<TruckIcon className="w-5 h-5 text-pink-600" />} text="Miễn phí giao hàng từ 200.000đ" />
        <PromoItem icon={<GiftIcon className="w-5 h-5 text-yellow-500" />} text="Quà tặng bất ngờ trong mỗi hộp snack" />
      </div>
    </div>
  );
}

function PromoItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4">
      {icon}
      <span>{text}</span>
    </div>
  );
}
