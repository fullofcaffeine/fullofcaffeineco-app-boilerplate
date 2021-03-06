package client.data;

import client.externs.Mobx.Mobx;
import client.externs.Mobx.MobxUtils;

import coconut.data.*;
import tink.pure.List;
using tink.CoreApi;

import client.data.TodoItem.TodoItemStore;
import client.data.TodoItem.TodoItemModel;



class TodoFilterModel implements Model {
  @:constant var options:List<Named<TodoItemModel->Bool>> = [
    new Named('All', function (_) return true),
    new Named('Active', TodoItemModel.isActive),
    new Named('Completed', TodoItemModel.isCompleted),
  ];

  @:observable var currentFilter:TodoItemModel->Bool = options.iterator().next().value;

  public function matches(item:TodoItemModel):Bool 
    return currentFilter(item);

  @:transition function toggle(filter:TodoItemModel->Bool) {
    for (o in options)
      if (o.value == filter) return { currentFilter: filter };
    return {};
  }
  
  public function isActive(filter:TodoItemModel->Bool)
    return filter == currentFilter;
}

@:expose
class TodoFilterStore {
  private var filter: TodoFilterModel;
  public var currentFilter: TodoItemModel -> Bool;
  public var foo: Bool = true;
  public var options: Array<Named<TodoItemModel->Bool>>;
  public var isActive: Bool;

  static function __init__():Void {
    Mobx.decorate(TodoFilterStore, {
      currentFilter: Mobx.observable
    });
  }

  public function new() {
    this.filter = new TodoFilterModel();

    this.filter.observables.currentFilter.bind({}, (f) -> {
      this.currentFilter = f;
    });

    this.options = this.filter.options.toArray();
  }

  public function toggle(filter: TodoItemModel -> Bool) {
    return this.filter.toggle(filter);
  }

  public function matches(store: TodoItemStore): Bool {
    return this.currentFilter(store.item);
  }
}
