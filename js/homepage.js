function getProducts(list) {
    list.forEach(element => {
        $("#products").append(`
        <div class="col-sm-3 pb-5">
          <div class="card text-center h-100" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
            <img src="${element.image}" alt="img" class="card-img-top pt-5 ps-5 pe-5">
            <div class="card-body d-flex flex-column">
              <h3 class="card-title" style="font-weight: bold;">${element.title} 8</h3>
              <h4 class="card-subtitle mb-4 text-muted">${element.price} kr</h4>
              <h5 class="card-text pb-4 px-3">${element.description}</h5>
              <div class="align-self-end" style="margin-top: auto; margin-left: auto; margin-right: auto">
                <button type="button" class="btn btn-outline-dark add1btn d-inline me-1" >-</button>
                  <div id="amount" class="d-inline">1</div>
                  <button type="button" class="btn btn-outline-dark add1btn d-inline ms-1">+</button>
                  <button id="btn1" type="button" class="btn btn-lg btn-block btn-outline-dark align-self ms-5" style="margin-top: auto">Lägg till varukorg</button></p>
              </div>
            </div>
          </div>
        </div>`
        );
      });
}