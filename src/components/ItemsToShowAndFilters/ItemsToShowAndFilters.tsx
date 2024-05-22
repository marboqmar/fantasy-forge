import "./ItemsToShowAndFilters.scss";
import { Link } from "react-router-dom";
import { FilterModel, ItemDetailsModel, ItemsFromAPIModel } from "../../models";
import { useState, useEffect } from "react";
// import ITEM_LIST from "../../lists/ITEM_LIST.ts";
import FILTER_OPTIONS_LIST from "../../lists/FILTER_OPTIONS_LIST.tsx";
import { Button } from "../Button/Button.tsx";
import { useContext } from "react";
import { SearchContext } from "../../contexts/SearchContextProvider.tsx";
import axios from "axios";

const ItemsToShowAndFilters = () => {
  const [shopItemsList, setShopItemsList] = useState<ItemDetailsModel[]>([]);
  const [displayedItems, setDisplayedItems] = useState<ItemDetailsModel[]>([]);
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const { search: searchValue } = useContext(SearchContext);

  // Fetch items from API and map them
  const mapItemsFromAPIToItemDetails = (
    items: ItemsFromAPIModel[],
  ): ItemDetailsModel[] => {
    return items.map((individualItem: ItemDetailsModel) => {
      return {
        key: individualItem.key,
        name: individualItem.name,
        img: individualItem.img,
        price: individualItem.price,
        description: individualItem.description,
        origin: individualItem.origin,
      };
    });
  };

  useEffect(() => {
    const fetchShopItemsList = async () => {
      const response = await axios.get(import.meta.env.VITE_API_URL);
      setShopItemsList(mapItemsFromAPIToItemDetails(response.data));
    };

    fetchShopItemsList();
  }, []);

  // Get search value from search bar on header
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  // Filter item list
  useEffect(() => {
    const updateDisplayedItems = (newActiveFilter: string) => {
      // Filter item list by active filter
      const newDisplayedItems: ItemDetailsModel[] = !newActiveFilter
        ? shopItemsList
        : shopItemsList.filter((item) => {
            return newActiveFilter === item.origin;
          });

      setDisplayedItems(newDisplayedItems);

      // Filter previous list (filtered by selected filter) by name search
      if (!search) {
        setDisplayedItems(newDisplayedItems);
      } else {
        setDisplayedItems(
          newDisplayedItems.filter((item: ItemDetailsModel) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
          }),
        );
      }
    };

    updateDisplayedItems(activeFilter);
  }, [search, activeFilter, shopItemsList]);

  const handleFilterChange = (option: string) => {
    setActiveFilter(option === activeFilter ? "" : option);
  };

  const FilterOptions = () => {
    return (
      <>
        {FILTER_OPTIONS_LIST().map((option: FilterModel) => (
          <div key={option.key}>
            <Button
              onClick={() => {
                handleFilterChange(option.key);
              }}
              color={"none"}
              paddingSize={"small"}
              withoutHover
              borderType={"squareBlack"}
              className={
                activeFilter === option.key ? "btn--filterClicked" : ""
              }
            >
              {option.name}
            </Button>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className={"filterAndItemDisplay"}>
        <div className={"filter"}>
          <FilterOptions />
        </div>
        <div className={"itemDisplay"}>
          {displayedItems.map((item: ItemDetailsModel) => (
            <Link
              className={"item-link"}
              to={`/detalles-producto/?ref=${item.key}`}
              key={`${item.img}${item.name}`}
            >
              <div className={"item"}>
                <img src={item.img} alt={""} />
                <div className={"item item-text"}>
                  <span className={"itemTitle"}>{item.name}</span>
                  <span>{item.price}€</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemsToShowAndFilters;
