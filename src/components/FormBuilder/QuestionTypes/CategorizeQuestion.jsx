import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';

const CategorizeQuestion = ({ question, onUpdate, isPreview, onAnswer }) => {
  const [localCategories, setLocalCategories] = useState(
    question.categories || []
  );
  const [localItems, setLocalItems] = useState(
    question.items || []
  );

  // For form filling mode
  const [userCategorization, setUserCategorization] = useState({});

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'CATEGORY') {
      // Reordering categories
      const newCategories = Array.from(localCategories);
      const [reorderedItem] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, reorderedItem);
      
      setLocalCategories(newCategories);
      if (onUpdate && !isPreview) {
        onUpdate(question.id, { categories: newCategories });
      }
    } else if (type === 'ITEM') {
      // Moving items between categories or uncategorized area
      const sourceCategory = source.droppableId;
      const destCategory = destination.droppableId;

      if (sourceCategory === destCategory) return;

      // Update user categorization for form filling
      if (onAnswer) {
        const itemId = result.draggableId;
        const newCategorization = { ...userCategorization };

        // Remove item from source category
        if (sourceCategory !== 'uncategorized') {
          newCategorization[sourceCategory] = (newCategorization[sourceCategory] || [])
            .filter(id => id !== itemId);
        }

        // Add item to destination category
        if (destCategory !== 'uncategorized') {
          newCategorization[destCategory] = [
            ...(newCategorization[destCategory] || []),
            itemId
          ];
        }

        setUserCategorization(newCategorization);
        onAnswer(question.id, { categorization: newCategorization });
      }
    }
  };

  const addCategory = () => {
    const newCategory = {
      id: generateId(),
      name: `Category ${localCategories.length + 1}`,
      items: []
    };
    
    const newCategories = [...localCategories, newCategory];
    setLocalCategories(newCategories);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { categories: newCategories });
    }
  };

  const updateCategory = (categoryId, name) => {
    const newCategories = localCategories.map(cat =>
      cat.id === categoryId ? { ...cat, name } : cat
    );
    
    setLocalCategories(newCategories);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { categories: newCategories });
    }
  };

  const removeCategory = (categoryId) => {
    const newCategories = localCategories.filter(cat => cat.id !== categoryId);
    setLocalCategories(newCategories);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { categories: newCategories });
    }
  };

  const addItem = () => {
    const newItem = {
      id: generateId(),
      text: `Item ${localItems.length + 1}`,
      image: ''
    };
    
    const newItems = [...localItems, newItem];
    setLocalItems(newItems);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { items: newItems });
    }
  };

  const updateItem = (itemId, updates) => {
    const newItems = localItems.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    setLocalItems(newItems);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { items: newItems });
    }
  };

  const removeItem = (itemId) => {
    const newItems = localItems.filter(item => item.id !== itemId);
    setLocalItems(newItems);
    
    if (onUpdate && !isPreview) {
      onUpdate(question.id, { items: newItems });
    }
  };

  const getCategorizedItems = (categoryId) => {
    if (onAnswer) {
      // Form filling mode - show items based on user categorization
      return (userCategorization[categoryId] || [])
        .map(itemId => localItems.find(item => item.id === itemId))
        .filter(Boolean);
    }
    return [];
  };

  const getUncategorizedItems = () => {
    if (onAnswer) {
      // Form filling mode - show items not in any category
      const categorizedItemIds = Object.values(userCategorization)
        .flat()
        .filter(Boolean);
      
      return localItems.filter(item => !categorizedItemIds.includes(item.id));
    }
    return localItems;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-sm text-gray-600">
          {onAnswer ? (
            <p>Drag items from the bottom into the correct categories above.</p>
          ) : (
            <p>Students will drag items into categories. Add categories and items below.</p>
          )}
        </div>

        {/* Categories */}
        <Droppable droppableId="categories" type="CATEGORY">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {localCategories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                  isDragDisabled={onAnswer || isPreview}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center flex-1">
                          {!onAnswer && !isPreview && (
                            <div {...provided.dragHandleProps} className="mr-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          
                          {onAnswer || isPreview ? (
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                          ) : (
                            <input
                              type="text"
                              value={category.name}
                              onChange={(e) => updateCategory(category.id, e.target.value)}
                              className="font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 flex-1"
                              placeholder="Category name"
                            />
                          )}
                        </div>
                        
                        {!onAnswer && !isPreview && (
                          <button
                            onClick={() => removeCategory(category.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Remove category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Drop Zone for Items */}
                      <Droppable droppableId={category.id} type="ITEM">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[60px] rounded-lg transition-colors ${
                              snapshot.isDraggingOver 
                                ? 'bg-primary-50 border-primary-300' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="space-y-2 p-2">
                              {getCategorizedItems(category.id).map((item, itemIndex) => (
                                <DraggableItem
                                  key={item.id}
                                  item={item}
                                  index={itemIndex}
                                  isDragDisabled={!onAnswer}
                                />
                              ))}
                            </div>
                            {provided.placeholder}
                            
                            {getCategorizedItems(category.id).length === 0 && (
                              <div className="text-center text-gray-400 text-sm py-4">
                                {onAnswer ? 'Drop items here' : 'Items will appear here when dropped'}
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add Category Button */}
        {!onAnswer && !isPreview && (
          <button
            onClick={addCategory}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        )}

        {/* Items Pool */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">
            {onAnswer ? 'Items to Categorize' : 'Items'}
          </h4>
          
          <Droppable droppableId="uncategorized" type="ITEM">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[80px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                  snapshot.isDraggingOver 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getUncategorizedItems().map((item, index) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={index}
                      onUpdate={!onAnswer && !isPreview ? updateItem : undefined}
                      onRemove={!onAnswer && !isPreview ? removeItem : undefined}
                      isDragDisabled={false}
                    />
                  ))}
                </div>
                {provided.placeholder}
                
                {getUncategorizedItems().length === 0 && onAnswer && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    All items have been categorized
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>

        {/* Add Item Button */}
        {!onAnswer && !isPreview && (
          <button
            onClick={addItem}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        )}
      </div>
    </DragDropContext>
  );
};

const DraggableItem = ({ item, index, onUpdate, onRemove, isDragDisabled }) => {
  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move transition-all duration-200 ${
            snapshot.isDragging 
              ? 'shadow-lg transform rotate-1 scale-105' 
              : 'hover:shadow-sm'
          }`}
        >
          {item.image && (
            <div className="mb-2">
              <img
                src={item.image}
                alt={item.text}
                className="w-full h-20 object-cover rounded"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {onUpdate ? (
              <input
                type="text"
                value={item.text}
                onChange={(e) => onUpdate(item.id, { text: e.target.value })}
                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                placeholder="Item text"
              />
            ) : (
              <span className="text-sm text-gray-900">{item.text}</span>
            )}
            
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="text-gray-400 hover:text-red-500 ml-2 p-1"
                title="Remove item"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          
          {onUpdate && (
            <div className="mt-2">
              <label className="text-xs text-gray-500 cursor-pointer flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" />
                Image URL (optional)
              </label>
              <input
                type="text"
                value={item.image || ''}
                onChange={(e) => onUpdate(item.id, { image: e.target.value })}
                className="w-full text-xs mt-1 p-1 border border-gray-200 rounded"
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CategorizeQuestion;