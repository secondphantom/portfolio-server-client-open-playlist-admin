import { ChannelHeaderOrderCombobox } from "./channel-header-order-combobox";
import { ChannelChannelIdSearchBar } from "./channel-channelId-search-bar";

export const ChannelHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center">
        <ChannelHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <ChannelChannelIdSearchBar />
      </div>
    </div>
  );
};
